import './css/admin.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabase';
import { useEffect, useState } from 'react';

import Make from './pages/form/make';
import NotFound from './pages/error/404';
import Home from './pages/form/main';
import AdminPage from './pages/form/admin';

import Youtube from './pages/youtube/youtube';

function App() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    async function getTodos() {
      const { data: todos } = await supabase.from('broadcasting').select()

      if (todos.length > 0) {
        setTodos(todos)
      }
    }

    getTodos()
  }, [])

  return (
    <Router>
      <div className='flex flex-col min-h-screen'>
        <main className='flex-grow'>
          <Routes>
            <Route path="/form" element={<Home /> } />
            <Route path="/form/adminpage" element={<AdminPage data={todos}/>} />
            <Route path="/form/make" element={<Make />}></Route>

            <Route path="/youtube" element={<Youtube />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
