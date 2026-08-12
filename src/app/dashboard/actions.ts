// src/app/dashboard/actions.ts
'use server'
 
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
 
export async function addTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
 
  if (!user) throw new Error('Not authenticated')
 
  const title = formData.get('title') as string
  const description = formData.get('description') as string
 
  await supabase.from('tasks').insert({
    title,
    description,
    user_id: user.id,
  })
 
  revalidatePath('/dashboard')
}
 
export async function toggleTask(taskId: string, completed: boolean) {
  const supabase = await createClient()
 
  await supabase
    .from('tasks')
    .update({ completed: !completed })
    .eq('id', taskId)
 
  revalidatePath('/dashboard')
}
 
export async function deleteTask(taskId: string) {
  const supabase = await createClient()
 
  await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
 
  revalidatePath('/dashboard')
}
 
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}