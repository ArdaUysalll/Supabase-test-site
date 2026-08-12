// src/app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { addTask, toggleTask, deleteTask, signOut } from '@/app/dashboard/actions'
 
export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
 
  if (!user) redirect('/login')
 
  const { data: tasks } = await supabase
    .from('tasks2')
    .select('*')
    .order('created_at', { ascending: false })
 
  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Sign Out
          </button>
        </form>
      </div>
 
      {/* Add Task Form */}
      <form action={addTask} className="mb-8 space-y-3">
        <input
          name="title"
          placeholder="Task title"
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          name="description"
          placeholder="Description (optional)"
          className="w-full p-3 border rounded-lg"
        />
        <input
        name="test_attribute"
        className='w-full p-3 border rounded-lg'
        />
        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Task
        </button>
      </form>
 
      {/* Task List */}
      <div className="space-y-3">
        {tasks?.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No tasks yet. Add one above!
          </p>
        )}
 
        {tasks?.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <form action={toggleTask.bind(null, task.id, task.completed)}>
                <button type="submit" className="text-xl">
                  {task.completed ? '✅' : '⬜'}
                </button>
              </form>
              <div>
                <p className={task.completed ? 'line-through text-gray-400' : ''}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-sm text-gray-500">{task.description}</p>
                )}
                  {task.test_attribute && (
                  <p className="text-sm text-gray-500">{task.test_attribute}</p>
                )}
                {/* Conditional rendering. IF desc exists, then render.  */}
              </div>
            </div>
 
            <form action={deleteTask.bind(null, task.id)}>
              <button
                type="submit"
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}