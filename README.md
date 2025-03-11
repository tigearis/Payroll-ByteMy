## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

SQL Dump

PGPASSWORD="npg_WavFRZ1lEx4U" pg_dump -s -U neondb_owner -h ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech neondb > schema.sql
PGPASSWORD="npg_WavFRZ1lEx4U" pg_dump -U neondb_owner -d neondb -h ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech -t table1,table2 -f dump.sql
