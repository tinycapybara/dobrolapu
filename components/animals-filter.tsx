"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"

export type FilterValues = {
  search: string
  type: string
  gender: string
  age: string
  size: string
  guardianship: string
  health: string
}

type AnimalsFilterProps = {
  filters: FilterValues
  onFilterChange: (filters: FilterValues) => void
  onReset: () => void
}

const ageOptions = [
  { value: "all", label: "Любой возраст" },
  { value: "0-6", label: "До 6 месяцев" },
  { value: "6-12", label: "6-12 месяцев" },
  { value: "12-36", label: "1-3 года" },
  { value: "36-84", label: "3-7 лет" },
  { value: "84+", label: "Старше 7 лет" },
]

const sizeOptions = [
  { value: "all", label: "Любой размер" },
  { value: "Маленький", label: "Маленький" },
  { value: "Средний", label: "Средний" },
  { value: "Большой", label: "Большой" },
]

export function AnimalsFilter({ filters, onFilterChange, onReset }: AnimalsFilterProps) {
  const updateFilter = (key: keyof FilterValues, value: string) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const hasActiveFilters =
    filters.search !== "" ||
    filters.type !== "all" ||
    filters.gender !== "all" ||
    filters.age !== "all" ||
    filters.size !== "all" ||
    filters.guardianship !== "all" ||
    filters.health !== "all"

  return (
    <div className="space-y-6 rounded-lg border bg-card p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Фильтры</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-8 gap-1 text-muted-foreground">
            <X className="size-4" />
            Сбросить
          </Button>
        )}
      </div>

      {/* Поиск по кличке */}
      <div className="space-y-2">
        <Label htmlFor="search">Поиск по кличке</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Введите кличку..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Тип животного */}
      <div className="space-y-2">
        <Label>Тип животного</Label>
        <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Все животные" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все животные</SelectItem>
            <SelectItem value="Кошка">Кошки</SelectItem>
            <SelectItem value="Собака">Собаки</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Пол */}
      <div className="space-y-2">
        <Label>Пол</Label>
        <Select value={filters.gender} onValueChange={(value) => updateFilter("gender", value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Любой пол" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Любой пол</SelectItem>
            <SelectItem value="Мальчик">Мальчик</SelectItem>
            <SelectItem value="Девочка">Девочка</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Возраст */}
      <div className="space-y-2">
        <Label>Возраст</Label>
        <Select value={filters.age} onValueChange={(value) => updateFilter("age", value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Любой возраст" />
          </SelectTrigger>
          <SelectContent>
            {ageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Размер */}
      <div className="space-y-2">
        <Label>Размер</Label>
        <Select value={filters.size} onValueChange={(value) => updateFilter("size", value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Любой размер" />
          </SelectTrigger>
          <SelectContent>
            {sizeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Опекунство */}
      <div className="space-y-2">
        <Label>Опекунство</Label>
        <Select value={filters.guardianship} onValueChange={(value) => updateFilter("guardianship", value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Все" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="Ищет опекуна">Ищет опекуна</SelectItem>
            <SelectItem value="Есть опекун">Есть опекун</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Здоровье */}
      <div className="space-y-2">
        <Label>Здоровье</Label>
        <Select value={filters.health} onValueChange={(value) => updateFilter("health", value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Все" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="healthy">Здоров</SelectItem>
            <SelectItem value="sick">Нуждается в лечении</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}