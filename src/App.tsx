import './styles/global.css'
import { useForm, useFieldArray } from 'react-hook-form'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from './lib/supabase'

const createUserFormSchema = z.object({
  avatar: z.instanceof(FileList)
  .transform(file => file.item(0)!)
  .refine(file => file.size <= 5 * 1024 * 1024, 'Arquivo até no máximo 5MB')
  ,

  name: z.string()
  .nonempty('O nome é obrigátorio!')
  .transform(name => {
    return name.trim().split(' ').map(word => {
      return word[0].toLocaleUpperCase().concat(word.substring(1))
    }).join(' ')
  })
  ,

  email: z.string()
  .nonempty('O e-mail é obrigátorio!')
  .email('Formato inválido!')
  .refine(email => {
    return email.endsWith('@gmail.com')
  }, 'O e-mail precisa ser da gmail')
  ,

  password: z.string()
    .min(6, 'A senha precisa ter no mínimo 6 caracteres'),

  techs: z.array(z.object({
    title: z.string().nonempty('O título é obrigatório!'),
    knowledge: z.coerce.number().min(1, 'O mínimo é 1').max(100, 'O máximo é 100')
  }))
  .min(2, 'Insira pelo menos 2 tecnologias')
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>

export default function App() {
  const [output, setOutput] = useState('')
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors },
    control,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema)
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs'
  })

  async function handleCreateUser(data: CreateUserFormData) {
    await supabase.storage.from('forms-react').upload(
      data.avatar.name,
      data.avatar
    )

    setOutput(JSON.stringify(data, null, 2))
    reset()
  }

  function AddNewTech() {
    append({  title: '', knowledge: 0 })
  }

  return (
    <main className="h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <form 
      onSubmit={handleSubmit(handleCreateUser)}
      className="flex flex-col gap-4 w-full max-w-lg mb-2"
      >
        <div className='flex flex-col gap-1'>
          <label htmlFor="avatar">Avatar:</label>
          <input 
          type="file" 
          accept='image/*'
          {...register('avatar')}
          />
          {errors.avatar && <span className='text-red-500 text-sm'>{errors.avatar.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="name">Name:</label>
          <input 
          type="name" 
          {...register('name')}
          className='text-black border border-zinc-200 shadow-sm rounded h-10 px-3'
          placeholder='Igor Abreu'
          />
          {errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="email">Email:</label>
          <input 
          type="email" 
          {...register('email')}
          className='text-black border border-zinc-200 shadow-sm rounded h-10 px-3'
          placeholder='email@example.com'
          />
          {errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="password">Senha:</label>
          <input 
          type="password"
          {...register('password')}
          className='text-black border border-zinc-200 shadow-sm rounded h-10 px-3' 
          placeholder='******'
          />
          {errors.password && <span className='text-red-500 text-sm'>{errors.password.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="" className='flex items-center justify-between'>
            Tecnologias:

            <button 
            onClick={AddNewTech}
            className='text-emerald-500 text-sm'
            type='button'
            >
              Adicionar
            </button>
          </label>

          {fields.map((field, index) => {
            return (
              <div key={field.id} className='flex gap-1 mb-2'>
                <div className='flex-1 flex flex-col'>
                  <input 
                  className='flex-1 text-black border border-zinc-200 shadow-sm rounded h-10 px-3' 
                  placeholder='Hello!'
                  type="text"
                  {...register(`techs.${index}.title`)}
                  />
                  {errors.techs?.[index]?.title && <span className='text-red-500 text-sm'>{errors.techs[index]?.title?.message}</span>}
                </div>

                <div className='w-16 flex flex-col'>
                  <input 
                  type="number"
                  className='text-black border border-zinc-200 shadow-sm rounded h-10 px-3' 
                  placeholder='******'
                  {...register(`techs.${index}.knowledge`)}
                  />
                  {errors.techs?.[index]?.knowledge && <span className='text-red-500 text-sm'>{errors.techs[index]?.knowledge?.message}</span>}
                </div>
              </div>
            )
          })}
          {errors.techs && <span className='text-red-500 text-sm'>{errors.techs.message}</span>}
        </div>

        <button 
        type="submit"
        className='bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600'
        > 
        Salvar
        </button>
      </form>
      <pre>
        {output}
      </pre>
    </main>
  )
}