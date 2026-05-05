import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Header } from "@/components/ui/header"

type AnimalRow = {
  id: number
  name: string
  gender: string
  breed: string | null
  age: number | null
  size: string
  description: string | null
  created_at: string
  animal_photos: { photo_url: string; is_main: boolean }[]
  animal_types: { type: string } | null
  animal_statuses: { status: string } | null
  guardianship_statuses: { guardianship: string } | null
}

function formatAge(months: number | null): string {
  if (months === null) return 'Возраст неизвестен'

  const pluralYears = (n: number) => {
    if (n % 10 === 1 && n % 100 !== 11) return 'год'
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 'года'
    return 'лет'
  }

  const pluralMonths = (n: number) => {
    if (n % 10 === 1 && n % 100 !== 11) return 'месяц'
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 'месяца'
    return 'месяцев'
  }

  const years = Math.floor(months / 12)
  const rem = months % 12

  if (years === 0) return `${months} ${pluralMonths(months)}`
  if (rem === 0) return `${years} ${pluralYears(years)}`
  return `${years} ${pluralYears(years)} ${rem} ${pluralMonths(rem)}`
}

export default async function TestSupabasePage() {
  const simpleQuery = await supabase.from('animals').select('id, name')
  const fullQuery = await supabase
    .from('animals')
    .select(`
      id, name, gender, breed, age, size, description, created_at,
      animal_photos(photo_url, is_main),
      animal_types(type),
      animal_statuses(status),
      guardianship_statuses(guardianship)
    `)

  const diagBg = '#f5f5f5'
  const diagStyle = { padding: '2rem', fontFamily: 'monospace', fontSize: '0.85rem' }

  if (simpleQuery.error || fullQuery.error) {
    return (
      <>
        <Header />
        <div style={diagStyle}>
          <h2>Ошибка запроса</h2>
          {simpleQuery.error && <pre style={{ color: 'red' }}>simple: {simpleQuery.error.message}</pre>}
          {fullQuery.error && <pre style={{ color: 'red' }}>full: {fullQuery.error.message}</pre>}
        </div>
      </>
    )
  }

  const diag = (
    <details style={{ background: diagBg, padding: '1rem', marginBottom: '1.5rem', borderRadius: '6px' }}>
      <summary style={{ cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.85rem' }}>
        Диагностика (кликни чтобы раскрыть)
      </summary>
      <pre style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
        {`simple select (id, name): ${simpleQuery.data?.length ?? 0} записей\n`}
        {`full select (с join): ${fullQuery.data?.length ?? 0} записей\n\n`}
        {`simple data:\n${JSON.stringify(simpleQuery.data, null, 2)}\n\n`}
        {`full data:\n${JSON.stringify(fullQuery.data, null, 2)}`}
      </pre>
    </details>
  )

  const animals = (fullQuery.data ?? []) as unknown as AnimalRow[]

  return (
    <>
      <Header />
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1 style={{ marginBottom: '1rem' }}>Животные ({animals.length})</h1>
        {diag}
        {animals.length === 0 ? (
          <p style={{ color: '#888' }}>
            Записей не вернулось. Проверь диагностику выше — скорее всего включён RLS без политики на чтение.
          </p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {animals.map((animal) => (
              <div
                key={animal.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  width: '220px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                }}
              >
                {(() => {
                  const photos = animal.animal_photos ?? []
                  const mainPhoto = photos.find((p) => p.is_main) ?? photos[0] ?? null
                  return mainPhoto ? (
                    <div style={{ position: 'relative', width: '220px', height: '180px' }}>
                      <Image
                        src={mainPhoto.photo_url}
                        alt={animal.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="220px"
                      />
                    </div>
                  ) : (
                  <div
                    style={{
                      width: '220px',
                      height: '180px',
                      background: '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#888',
                      fontSize: '0.85rem',
                    }}
                  >
                    Нет фото
                  </div>
                  )
                })()}
                <div style={{ padding: '0.75rem' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.4rem' }}>
                    {animal.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#555', lineHeight: '1.6' }}>
                    <div>Тип: {animal.animal_types?.type ?? '—'}</div>
                    <div>Статус: {animal.animal_statuses?.status ?? '—'}</div>
                    {animal.guardianship_statuses && (
                      <div>Опекунство: {animal.guardianship_statuses.guardianship}</div>
                    )}
                    <div>Возраст: {formatAge(animal.age)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}