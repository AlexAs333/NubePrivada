import { useState, useEffect, useRef } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { Folder, FileText, Upload, Plus, Download, Trash2 } from 'lucide-react'

function Explorador() {
  const { id } = useParams()
  const navigate = useNavigate()
  const carpetaId = id || '1' // Por defecto carga la raíz (ID 1)
  
  const [carpeta, setCarpeta] = useState(null)
  const [error, setError] = useState(null)
  
  const fileInputRef = useRef(null)

  useEffect(() => {
    setCarpeta(null)
    fetch(`/api/carpetas/${carpetaId}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar la carpeta')
        return res.json()
      })
      .then(data => setCarpeta(data))
      .catch(err => setError(err.message))
  }, [carpetaId])

  const handleCrearCarpeta = async () => {
    const nombre = prompt('Nombre de la nueva carpeta:');
    if (!nombre) return;

    try {
      const res = await fetch('/api/carpetas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombre: nombre, 
          parentId: carpeta.id 
        })
      });

      if (res.ok) {
        const nuevaCarpeta = await res.json();
        setCarpeta({
          ...carpeta,
          subcarpetas: [...carpeta.subcarpetas, nuevaCarpeta]
        });
      } else {
        alert('Error al crear la carpeta');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    }
  };

  const handleSubirArchivo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('carpetaId', carpeta.id);

    try {
      const res = await fetch('/api/ficheros', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const nuevoFichero = await res.json();
        setCarpeta({
          ...carpeta,
          ficheros: [...carpeta.ficheros, nuevoFichero]
        });
      } else {
        alert('Error al subir el archivo');
      }
    } catch (error) {
      console.error(error);
      alert('Error de red');
    }
  };

  const handleDescargar = (fichId) => {
    window.open(`/api/ficheros/${fichId}/download`, '_blank');
  };

  const handleEliminar = async (fichId) => {
    if (!confirm('¿Seguro que quieres eliminar este archivo?')) return;

    try {
      const res = await fetch(`/api/ficheros/${fichId}`, { method: 'DELETE' });
      if (res.ok) {
        setCarpeta({
          ...carpeta,
          ficheros: carpeta.ficheros.filter(f => f.id !== fichId)
        });
      } else {
        alert('Error al eliminar el archivo');
      }
    } catch (error) {
      console.error(error);
      alert('Error al eliminar');
    }
  };

  if (error) return <div className="p-10 text-red-500 font-bold">Error: {error}</div>
  if (!carpeta) return <div className="p-10 text-gray-500 animate-pulse">Cargando...</div>

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Folder className="text-blue-500 w-8 h-8" /> 
          {carpeta.nombre}
        </h1>
        <div className="flex gap-2">
          <button 
            onClick={handleCrearCarpeta} 
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Nueva
          </button>
          <input 
            type="file" 
            style={{ display: 'none' }} 
            ref={fileInputRef} 
            onChange={handleSubirArchivo} 
          />
          <button 
            onClick={() => fileInputRef.current.click()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 cursor-pointer"
          >
            <Upload className="w-4 h-4" /> Subir
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {carpeta.subcarpetas?.map(sub => (
          <div 
            key={sub.id} 
            onClick={() => navigate(`/${sub.id}`)}
            className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all flex items-center gap-3"
          >
            <Folder className="text-blue-400 w-6 h-6 fill-current" />
            <span className="font-medium text-gray-700 truncate">{sub.nombre}</span>
          </div>
        ))}
        
        {carpeta.ficheros?.map(fich => (
          <div 
            key={fich.id} 
            className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-3">
              <FileText className="text-gray-400 w-8 h-8 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700 truncate w-full" title={fich.nombre}>
                {fich.nombre}
              </span>
            </div>
            
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-50">
              <button 
                onClick={() => handleDescargar(fich.id)} 
                className="p-1 text-gray-500 hover:text-blue-600 rounded hover:bg-gray-100 cursor-pointer"
                title="Descargar"
              >
                <Download className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleEliminar(fich.id)} 
                className="p-1 text-gray-500 hover:text-red-600 rounded hover:bg-gray-100 cursor-pointer"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {carpeta.subcarpetas?.length === 0 && carpeta.ficheros?.length === 0 && (
        <div className="mt-12 text-center text-gray-400">
          Esta carpeta está vacía.
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Explorador />} />
      <Route path="/:id" element={<Explorador />} />
    </Routes>
  )
}