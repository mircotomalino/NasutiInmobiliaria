import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, User, AlertCircle, ArrowLeft } from "lucide-react";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simular un pequeño delay para mejor UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(username, password);

    if (success) {
      navigate("/admin");
    } else {
      setError("Credenciales incorrectas. Intenta nuevamente.");
    }

    setIsLoading(false);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#f0782c] to-[#e06a1f] flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Link de volver */}
      <div className="w-full max-w-sm mb-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-white hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Volver al home</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-gradient-to-r from-[#f0782c] to-[#e06a1f] rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            Acceso Administrativo
          </h1>
          <p className="text-sm text-gray-600">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Usuario */}
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-medium text-gray-700 mb-1.5"
            >
              Usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f0782c] focus:border-transparent transition-colors"
                placeholder="Ingresa tu usuario"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-700 mb-1.5"
            >
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="block w-full pl-9 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f0782c] focus:border-transparent transition-colors"
                placeholder="Ingresa tu contraseña"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="min-h-[3rem]">
            {error && (
              <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs">{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full bg-gradient-to-r from-[#f0782c] to-[#e06a1f] text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:from-[#e06a1f] hover:to-[#d55a0f] focus:outline-none focus:ring-2 focus:ring-[#f0782c] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verificando...
              </div>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Nasuti Inmobiliaria - Panel de Administración
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
