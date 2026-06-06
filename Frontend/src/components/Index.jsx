import { Link, useNavigate } from 'react-router-dom'
export default function Index() {
  return (
    <>
    <header className='bg-red-500 w-full p-5 gap-2'>
        <h1 className='text-white text-2xl font-bold text-center'>Estadisticas Listas</h1>
        <p className='text-white text-center'>Puedes ver tus analisis de las listas de la semana!</p>
    </header>   
    <main className='bg-blue-500 w-full p-5'>
        <div className='flex flex-col items-center justify-center p-2'>
            <h2 className='text-white text-2xl font-bold text-center'>Listas</h2>
            <p className='text-white text-center'>Puedes ver tus analisis de las listas de la semana!</p>
            <section className='bg-green-300 p-10 flex'>
              <article className='p-2 border-3 border-red-500'>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt nisi tempore nostrum id voluptatem totam placeat asperiores corrupti, obcaecati et exercitationem ipsum ipsam in dolorum autem nobis doloremque perspiciatis! Distinctio cumque veritatis corporis porro possimus fugiat vitae tempora. Tempore autem amet eum officia nostrum, 
              laboriosam ut dolorum enim sint obcaecati? Impedit, consequatur ipsam ut illo itaque quod? Rerum possimus excepturi incidunt exercitationem eius animi minus sit illo distinctio necessitatibus velit dicta, nesciunt sequi error iure reiciendis. Aspernatur animi voluptatem, quae, voluptas ab provident eum pariatur soluta, odit vitae a cumque eveniet sit!
              Eaque laboriosam impedit officia est, cum perspiciatis accusantium, quod veniam repellat accusamus quibusdam veritatis,
              necessitatibus eos in voluptas modi omnis nesciunt similique labore magnam odit! Eligendi officiis, sit explicabo cumque corrupti ex repellendus maiores fugit quo tempore deleniti? Vel sint reiciendis sed quaerat adipisci consectetur? Expedita animi cumque dolor voluptate odio dolores, quia possimus. Vitae pariatur, 
              expedita sit iste odio nemo ab recusandae. Sed nobis exercitationem fugiat dicta eaque sequi iure ipsa! 
              Ipsam, ut. Qui explicabo maiores officia quasi odit est dolorem porro, in dolor assumenda doloribus sint laudantium 
              mollitia iste suscipit natus doloremque dicta fugiat. Expedita doloremque maiores quod distinctio possimus. Voluptatibus aspernatur itaque vero suscipit beatae?</p>
              </article>
              <article className='p-2 border-3 border-blue-500'>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt nisi tempore nostrum id voluptatem totam placeat asperiores corrupti, obcaecati et exercitationem ipsum ipsam in dolorum autem nobis doloremque perspiciatis! Distinctio cumque veritatis corporis porro possimus fugiat vitae tempora. Tempore autem amet eum officia nostrum, 
              laboriosam ut dolorum enim sint obcaecati? Impedit, consequatur ipsam ut illo itaque quod? Rerum possimus excepturi incidunt exercitationem eius animi minus sit illo distinctio necessitatibus velit dicta, nesciunt sequi error iure reiciendis. Aspernatur animi voluptatem, quae, voluptas ab provident eum pariatur soluta, odit vitae a cumque eveniet sit!
              Eaque laboriosam impedit officia est, cum perspiciatis accusantium, quod veniam repellat accusamus quibusdam veritatis,
              necessitatibus eos in voluptas modi omnis nesciunt similique labore magnam odit! Eligendi officiis, sit explicabo cumque corrupti ex repellendus maiores fugit quo tempore deleniti? Vel sint reiciendis sed quaerat adipisci consectetur? Expedita animi cumque dolor voluptate odio dolores, quia possimus. Vitae pariatur, 
              expedita sit iste odio nemo ab recusandae. Sed nobis exercitationem fugiat dicta eaque sequi iure ipsa! 
              Ipsam, ut. Qui explicabo maiores officia quasi odit est dolorem porro, in dolor assumenda doloribus sint laudantium 
              mollitia iste suscipit natus doloremque dicta fugiat. Expedita doloremque maiores quod distinctio possimus. Voluptatibus aspernatur itaque vero suscipit beatae?</p>
              </article>
            </section>
        </div>
        <div className='w-full bg-purple-500 p-10'>
          <p className='bg-yellow-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, corporis molestias odio necessitatibus alias excepturi temporibus pariatur aperiam repellat reprehenderit est quis velit ea quisquam laudantium quia soluta cumque. Molestias at totam, fugit cupiditate maiores neque iure quis vitae, ea esse repellendus sapiente! Deleniti suscipit fuga libero. Odio rem eveniet voluptatibus quasi dolorem culpa perferendis tempore incidunt earum veritatis obcaecati sit similique minima, autem maxime quo repudiandae consequuntur aliquid fugiat id ut asperiores ipsum assumenda. Fugit rem numquam nam placeat at! Eveniet ex quasi quod ea sequi quisquam modi obcaecati, aspernatur optio, eius illo, vel eaque iusto. Eveniet, quos tenetur.</p>
        </div>
    </main>
    <footer className='bg-green-500/50 w-full p-5 mt-auto'>
        <p className='text-gray-500 text-center'>EstadisticasYA!</p>
        <p className='text-gray-900 text-center'>Todos los derechos reservados &copy; {new Date().getFullYear()}</p>
    </footer>
    </>
  )
}