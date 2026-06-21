"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

type AnimalPayload = {
  name: string
  gender: string
  breed: string | null
  age: number | null
  size: string
  type_id: number
  status_id: number
  guardianship_id: number
  description: string | null
}

export async function createAnimal(payload: AnimalPayload): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from("animals")
    .insert(payload)
    .select("id")
    .single()

  if (error) throw new Error(error.message)

  revalidatePath("/admin/animals")
  return data.id
}

export async function updateAnimal(id: number, payload: AnimalPayload) {
  const { error } = await supabaseAdmin
    .from("animals")
    .update(payload)
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/animals")
  revalidatePath(`/admin/animals/${id}`)
  revalidatePath(`/pets/${id}`)
}

export async function deletePhoto(photoId: number, animalId: number) {
  const { error } = await supabaseAdmin
    .from("animal_photos")
    .delete()
    .eq("id", photoId)

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/animals/${animalId}`)
  revalidatePath(`/pets/${animalId}`)
}

export async function setMainPhoto(photoId: number, animalId: number) {
  await supabaseAdmin
    .from("animal_photos")
    .update({ is_main: false })
    .eq("animal_id", animalId)

  const { error } = await supabaseAdmin
    .from("animal_photos")
    .update({ is_main: true })
    .eq("id", photoId)

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/animals/${animalId}`)
  revalidatePath(`/pets/${animalId}`)
}

export async function markFoundHome(animalId: number) {
  const { error } = await supabaseAdmin
    .from("animals")
    .update({ status_id: 2, adopted_at: new Date().toISOString() })
    .eq("id", animalId)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/animals")
  revalidatePath(`/admin/animals/${animalId}`)
  revalidatePath("/pets")
  revalidatePath(`/pets/${animalId}`)
  revalidatePath("/adopted")
}

export async function deleteAnimal(animalId: number) {
  await supabaseAdmin.from("animal_photos").delete().eq("animal_id", animalId)

  const { error } = await supabaseAdmin.from("animals").delete().eq("id", animalId)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/animals")
  revalidatePath("/pets")
  redirect("/admin/animals")
}

export async function addPhoto(animalId: number, photoUrl: string, isMain: boolean) {
  if (isMain) {
    await supabaseAdmin
      .from("animal_photos")
      .update({ is_main: false })
      .eq("animal_id", animalId)
  }

  const { error } = await supabaseAdmin
    .from("animal_photos")
    .insert({ animal_id: animalId, photo_url: photoUrl, is_main: isMain })

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/animals/${animalId}`)
  revalidatePath(`/pets/${animalId}`)
}
