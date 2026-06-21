"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { AnimalCard, type Animal } from "@/components/animal-card"
import { AnimalsFilter, type FilterValues } from "@/components/animals-filter"
import { Button } from "@/components/ui/button"
import { Loader2, PawPrint, X } from "lucide-react"

const ITEMS_PER_PAGE = 6

const defaultFilters: FilterValues = {
  search: "",
  type: "all",
  gender: "all",
  age: "all",
  size: "all",
  guardianship: "all",
  health: "all",
}

function parseAgeRange(ageValue: string): { min: number; max: number } | null {
  if (ageValue === "all") return null
  if (ageValue.endsWith("+")) return { min: Number(ageValue.slice(0, -1)), max: Infinity }
  const [min, max] = ageValue.split("-").map(Number)
  return { min, max }
}

export function AnimalsGrid({
  animals,
  sickAnimalIds,
  initialFilters,
  fromQuiz,
  isSpecial,
}: {
  animals: Animal[]
  sickAnimalIds: number[]
  initialFilters?: Partial<FilterValues>
  fromQuiz?: boolean
  isSpecial?: boolean
}) {
  const [filters, setFilters] = useState<FilterValues>({ ...defaultFilters, ...initialFilters })
  const [quizBannerDismissed, setQuizBannerDismissed] = useState(false)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [isLoading, setIsLoading] = useState(false)

  // Фильтрация животных
  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      // Спецрежим «особенно нужен»: пожилые (≥85 мес) ИЛИ болеющие
      if (isSpecial) {
        const isOld = animal.age !== null && animal.age >= 85
        const isSick = sickAnimalIds.includes(animal.id)
        return isOld || isSick
      }

      // Поиск по кличке
      if (filters.search && !animal.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      // Тип животного
      if (filters.type !== "all" && animal.animal_types?.type !== filters.type) {
        return false
      }

      // Пол
      if (filters.gender !== "all" && animal.gender !== filters.gender) {
        return false
      }

      // Возраст
      const ageRange = parseAgeRange(filters.age)
      if (ageRange && animal.age !== null) {
        if (animal.age < ageRange.min || animal.age > ageRange.max) {
          return false
        }
      }

      // Размер
      if (filters.size !== "all" && animal.size !== filters.size) {
        return false
      }

      // Опекунство
      if (filters.guardianship !== "all" && animal.guardianship_statuses?.guardianship !== filters.guardianship) {
        return false
      }

      // Здоровье
      if (filters.health === "sick" && !sickAnimalIds.includes(animal.id)) {
        return false
      }
      if (filters.health === "healthy" && sickAnimalIds.includes(animal.id)) {
        return false
      }

      return true
    })
  }, [animals, filters, isSpecial, sickAnimalIds])

  // Видимые животные
  const visibleAnimals = filteredAnimals.slice(0, visibleCount)
  const hasMore = visibleCount < filteredAnimals.length

  // Показать ещё
  const handleShowMore = () => {
    setIsLoading(true)
    // Имитация загрузки
    setTimeout(() => {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
      setIsLoading(false)
    }, 300)
  }

  // Сброс фильтров
  const handleReset = () => {
    setFilters(defaultFilters)
    setVisibleCount(ITEMS_PER_PAGE)
  }

  // При изменении фильтров сбрасываем количество видимых
  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters)
    setVisibleCount(ITEMS_PER_PAGE)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Баннер результатов квиза */}
      {fromQuiz && !quizBannerDismissed && (
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#FAF0F3] border border-[#D4849A]/20 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-[#D4849A]/15 flex items-center justify-center shrink-0">
              <PawPrint className="size-5 text-[#D4849A]" />
            </div>
            <div>
              <p className="font-semibold text-stone-800 text-sm">Подбор по квизу</p>
              <p className="text-xs text-stone-500">Показываем питомцев, которые подходят именно тебе. Фильтры можно скорректировать.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/quiz" className="text-xs text-[#D4849A] hover:underline underline-offset-2">
              Пройти заново
            </Link>
            <button
              onClick={() => setQuizBannerDismissed(true)}
              className="text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
      {/* Фильтры - сбоку на десктопе, сверху на мобильном */}
      <aside className="w-full shrink-0 lg:w-72">
        <AnimalsFilter 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onReset={handleReset} 
        />
      </aside>

      {/* Сетка карточек */}
      <div className="flex-1">
        {/* Счётчик */}
        <div className="mb-4 text-sm text-stone-400 font-medium">
          Найдено: {filteredAnimals.length} {filteredAnimals.length === 1 ? "питомец" :
            filteredAnimals.length < 5 ? "питомца" : "питомцев"}
        </div>

        {filteredAnimals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white py-16 text-center">
            <p className="text-lg font-semibold text-stone-800">Ничего не найдено</p>
            <p className="mt-1 text-sm text-stone-400">
              Попробуйте изменить параметры фильтра
            </p>
            <Button variant="outline" onClick={handleReset} className="mt-4 rounded-xl border-[#D4849A] text-[#D4849A] hover:bg-[#D4849A]/10">
              Сбросить фильтры
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visibleAnimals.map((animal) => (
                <AnimalCard key={animal.id} animal={{ ...animal, isSick: sickAnimalIds.includes(animal.id) }} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShowMore}
                  disabled={isLoading}
                  className="rounded-xl border-[#D4849A] text-[#D4849A] hover:bg-[#D4849A]/10"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    `Показать ещё (${filteredAnimals.length - visibleCount})`
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </div>
  )
}