"""
scripts/import-pix-historical.py

Lê uma planilha Excel com PIXes históricos (4 colunas: Data, E-mail, Valor, Fonte)
e insere em donation_events como source='pix'.

source_id é determinístico (SHA256 do conteúdo) → re-upload do mesmo Excel é idempotente.
A coluna Fonte (banco: Santander/Cora/Mercado Pago/Inter) é guardada em raw_payload JSONB
pra não perdermos a informação.

Uso:
    DATABASE_URL=postgresql://... python scripts/import-pix-historical.py <caminho.xlsx>
"""

import hashlib
import json
import os
import sys
from pathlib import Path

import pandas as pd
import psycopg2

EXCEL_PATH = sys.argv[1] if len(sys.argv) > 1 else r'H:\patronos_limpa.xlsx'
DATABASE_URL = os.environ['DATABASE_URL']


def hash_event(row):
    """source_id determinístico baseado no conteúdo da linha."""
    key = (
        f"{row['Data'].strftime('%Y-%m-%d')}|"
        f"{row['E-mail'].lower().strip()}|"
        f"{row['Valor']:.2f}|"
        f"{row['Fonte'].strip()}"
    )
    return 'pix-legacy-' + hashlib.sha256(key.encode()).hexdigest()[:16]


def main():
    df = pd.read_excel(EXCEL_PATH)
    df['source_id'] = df.apply(hash_event, axis=1)

    # Sanity check — source_ids devem ser únicos no arquivo
    dups = df[df['source_id'].duplicated(keep=False)]
    if len(dups) > 0:
        print(f'⚠️  {len(dups)} duplicatas no arquivo (mesmo email/data/valor/fonte):')
        print(dups.to_string())
        print()

    print(f'Arquivo:    {EXCEL_PATH}')
    print(f'Linhas:     {len(df)}')
    print(f'Valor:      R$ {df["Valor"].sum():,.2f}')
    print(f'Período:    {df["Data"].min().date()} → {df["Data"].max().date()}')
    print(f'Emails:     {df["E-mail"].nunique()} únicos')
    print(f'Source IDs: {df["source_id"].nunique()} únicos (esperado ≈ {len(df)})')
    print()

    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cur = conn.cursor()

    inserted = 0
    skipped = 0
    failed = 0
    failed_rows = []

    for idx, row in df.iterrows():
        try:
            payload = {'fonte': row['Fonte']}
            cur.execute(
                """
                INSERT INTO donation_events (donor_email, amount, occurred_at, source, source_id, raw_payload)
                VALUES (%s, %s, %s, 'pix', %s, %s)
                ON CONFLICT (source, source_id) WHERE source_id IS NOT NULL DO NOTHING
                RETURNING id
                """,
                (
                    row['E-mail'].lower().strip(),
                    float(row['Valor']),
                    row['Data'].strftime('%Y-%m-%d'),
                    row['source_id'],
                    json.dumps(payload),
                ),
            )
            if cur.rowcount > 0:
                inserted += 1
            else:
                skipped += 1
        except Exception as e:
            failed += 1
            failed_rows.append((idx, str(e)))
            conn.rollback()
            cur = conn.cursor()

    conn.commit()
    cur.close()
    conn.close()

    print('=== Resultado ===')
    print(f'✓ Inseridos: {inserted}')
    print(f'⊘ Pulados (duplicados): {skipped}')
    print(f'✗ Falhas: {failed}')
    if failed_rows:
        print('\nFalhas detalhadas:')
        for idx, err in failed_rows[:5]:
            print(f'  row {idx}: {err}')


if __name__ == '__main__':
    main()
