"""
scripts/import-profiles.py

Lê uma planilha Excel com perfis de doadores (Email, Nome, RM, Tipo, Status, Assinatura)
e insere em `donors` SÓ os emails que ainda não existem na tabela.

Mapeamento:
    Email      → email
    Nome       → nome
    RM         → rm  (NULL se "-" ou vazio)
    Tipo       → tipo_contribuicao  (Pontual | Recorrente)
    Status     → estado_assinatura  (NaN → 'N/A')
    Assinatura → valor_assinatura

Uso:
    DATABASE_URL=postgresql://... python scripts/import-profiles.py <caminho.xlsx>
"""

import os
import sys

import pandas as pd
import psycopg2

EXCEL_PATH = sys.argv[1] if len(sys.argv) > 1 else r'H:\CadastroPatronos.xlsx'
DATABASE_URL = os.environ['DATABASE_URL']


def norm_rm(v):
    if pd.isna(v):
        return None
    s = str(v).strip()
    if not s or s == '-':
        return None
    return s


def norm_tipo(v):
    if pd.isna(v):
        return 'Pontual'
    s = str(v).strip()
    return 'Recorrente' if s == 'Recorrente' else 'Pontual'


def norm_status(v):
    if pd.isna(v):
        return 'N/A'
    s = str(v).strip()
    return s if s in ('Ativa', 'Pausada', 'Cancelada', 'N/A') else 'N/A'


def main():
    df = pd.read_excel(EXCEL_PATH)
    print(f'Arquivo: {EXCEL_PATH}')
    print(f'Linhas:  {len(df)}')
    print()

    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cur = conn.cursor()

    # 1. Pega emails que ja existem
    emails_lower = [str(e).lower().strip() for e in df['Email'] if pd.notna(e)]
    cur.execute(
        "SELECT LOWER(email) FROM donors WHERE LOWER(email) = ANY(%s)",
        (emails_lower,),
    )
    existing = {row[0] for row in cur.fetchall()}
    print(f'Ja existem em donors: {len(existing)}')

    to_insert = [
        row for _, row in df.iterrows()
        if pd.notna(row['Email']) and str(row['Email']).lower().strip() not in existing
    ]
    print(f'A inserir:            {len(to_insert)}')
    print()

    inserted = 0
    skipped = 0
    failed = 0
    failed_rows = []

    for row in to_insert:
        email = str(row['Email']).lower().strip()
        nome = str(row['Nome']).strip()
        rm = norm_rm(row['RM'])
        tipo = norm_tipo(row['Tipo'])
        estado = norm_status(row['Status'])
        valor = float(row['Assinatura']) if pd.notna(row['Assinatura']) else 0.0

        try:
            cur.execute(
                """
                INSERT INTO donors (email, nome, rm, tipo_contribuicao, estado_assinatura, valor_assinatura)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (email) DO NOTHING
                RETURNING email
                """,
                (email, nome, rm, tipo, estado, valor),
            )
            if cur.rowcount > 0:
                inserted += 1
            else:
                skipped += 1
        except Exception as e:
            failed += 1
            failed_rows.append((email, str(e)))
            conn.rollback()
            cur = conn.cursor()

    conn.commit()

    # Estado final
    cur.execute("SELECT COUNT(*) FROM donors")
    total_donors = cur.fetchone()[0]
    cur.execute("""
        SELECT COUNT(DISTINCT donor_email)
        FROM donation_events
        WHERE LOWER(donor_email) NOT IN (SELECT LOWER(email) FROM donors)
    """)
    orphans = cur.fetchone()[0]

    cur.close()
    conn.close()

    print('=== Resultado ===')
    print(f'Inseridos: {inserted}')
    print(f'Pulados:   {skipped}')
    print(f'Falhas:    {failed}')
    if failed_rows:
        print('\nFalhas detalhadas:')
        for email, err in failed_rows[:5]:
            print(f'  {email}: {err}')
    print()
    print(f'Total de doadores no banco: {total_donors}')
    print(f'Emails orfaos restantes:    {orphans}')


if __name__ == '__main__':
    main()
