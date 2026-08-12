// src/app/dashboard/actions.ts
'use server'
 
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
 
export async function addTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser() //run createclient and await authentication
 
  if (!user) throw new Error('Not authenticated') //If NOT user, throw error
 
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const test_attribute = formData.get('test_attribute') as string
 
  await supabase.from('tasks2').insert({
    title,
    description,
    user_id: user.id,
    test_attribute,
    
  }) // ADD the new task to the table
 
  revalidatePath('/dashboard')
  //can't  rerout inside component, so you revalidate
}
 



export async function toggleTask(taskId: string, completed: boolean) {
  const supabase = await createClient()
 
  await supabase
    .from('tasks2')
    .update({ completed: !completed })
    .eq('id', taskId)
 
  revalidatePath('/dashboard')
} // when toggled turn tasks state to the opposite. Probably delete later
 
export async function deleteTask(taskId: string) {
  const supabase = await createClient()
 
  await supabase
    .from('tasks2')
    .delete()
    .eq('id', taskId)
 
  revalidatePath('/dashboard')
} // delete said task from the database
 
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}