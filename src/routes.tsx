import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas Públicas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Questionario from './pages/Questionario';
import Recomendacao from './pages/Recomendacao';
import DetalhesComponentes from './pages/DetalhesComponentes';

// ✅ NOVA PÁGINA: Minhas Builds
import MinhasBuilds from './pages/MinhaBuilds';

// Páginas Admin
import Admin from './pages/Admin';
import GerenciarUsuarios from './pages/GerenciarUsuarios';

// Formulários Admin
import CpuForm from './components/admin/CpuForm';
import GpuForm from './components/admin/GpuForm';
import PlacaMaeForm from './components/admin/PlacaMaeForm';
import MemoriaRamForm from './components/admin/MemoriaRamForm';
import ArmazenamentoForm from './components/admin/ArmazenamentoForm';
import FonteForm from './components/admin/FonteForm';
import GabineteForm from './components/admin/GabineteForm';
import RefrigeracaoForm from './components/admin/RefrigeracaoForm';

const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      {/* ========================================
          ROTAS PÚBLICAS
      ======================================== */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/questionario" element={<Questionario />} />
      <Route path="/recomendacao" element={<Recomendacao />} />
      <Route path="/detalhes-componentes" element={<DetalhesComponentes />} />
      
      {/* ========================================
          ✅ NOVA ROTA PROTEGIDA: MINHAS BUILDS
      ======================================== */}
      <Route 
        path="/minhas-builds" 
        element={
          <ProtectedRoute requireAdmin={false}>
            <MinhasBuilds />
          </ProtectedRoute>
        } 
      />
      
      {/* ========================================
          ROTAS PROTEGIDAS - ADMIN DASHBOARD
      ======================================== */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <Admin />
          </ProtectedRoute>
        } 
      />
      
      {/* ========================================
          ROTAS PROTEGIDAS - GERENCIAMENTO DE USUÁRIOS
      ======================================== */}
      <Route 
        path="/admin/usuarios" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <GerenciarUsuarios />
          </ProtectedRoute>
        } 
      />

      {/* ========================================
          ROTAS PROTEGIDAS - CRUD DE COMPONENTES
      ======================================== */}
      
      {/* CPU */}
      <Route 
        path="/admin/cpus" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <CpuForm />
          </ProtectedRoute>
        } 
      />

      {/* GPU */}
      <Route 
        path="/admin/gpus" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <GpuForm />
          </ProtectedRoute>
        } 
      />

      {/* Placa-mãe */}
      <Route 
        path="/admin/placas-mae" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <PlacaMaeForm />
          </ProtectedRoute>
        } 
      />

      {/* Memória RAM */}
      <Route 
        path="/admin/memorias-ram" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <MemoriaRamForm />
          </ProtectedRoute>
        } 
      />

      {/* Armazenamento */}
      <Route 
        path="/admin/armazenamentos" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <ArmazenamentoForm />
          </ProtectedRoute>
        } 
      />

      {/* Fonte */}
      <Route 
        path="/admin/fontes" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <FonteForm />
          </ProtectedRoute>
        } 
      />

      {/* Gabinete */}
      <Route 
        path="/admin/gabinetes" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <GabineteForm />
          </ProtectedRoute>
        } 
      />

      {/* Refrigeração */}
      <Route 
        path="/admin/refrigeracoes" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <RefrigeracaoForm />
          </ProtectedRoute>
        } 
      />
    </Routes>
  </>
);

export default AppRoutes;
