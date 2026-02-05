/**
 * Global Error Boundary and Handler
 * Captura erros não tratados na aplicação
 * @module lib/error-boundary
 */

import React, { ReactNode, Component, ErrorInfo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component para capturar erros de React
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error:', error);
    console.error('Error Info:', errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ScrollView className="flex-1 bg-red-50 p-4">
          <View className="mt-8">
            <Text className="text-3xl font-bold text-red-700 mb-4">
              ⚠️ Algo deu errado
            </Text>

            <View className="bg-red-100 rounded-lg p-4 mb-4">
              <Text className="text-red-900 font-semibold mb-2">
                Erro:
              </Text>
              <Text className="text-red-800 font-mono text-sm">
                {this.state.error?.message}
              </Text>
            </View>

            {this.state.errorInfo && (
              <View className="bg-red-100 rounded-lg p-4 mb-4">
                <Text className="text-red-900 font-semibold mb-2">
                  Detalhes:
                </Text>
                <Text className="text-red-800 text-xs font-mono">
                  {this.state.errorInfo.componentStack}
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={this.resetError}
              className="bg-blue-600 rounded-lg p-4 mb-2"
            >
              <Text className="text-white font-bold text-center">
                🔄 Tentar Novamente
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // Recarregar app
                if (typeof window !== 'undefined') {
                  window.location.reload?.();
                }
              }}
              className="bg-gray-600 rounded-lg p-4"
            >
              <Text className="text-white font-bold text-center">
                🔁 Reiniciar Aplicação
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

/**
 * Setup global error handler
 */
export function setupGlobalErrorHandler() {
  // Handle unhandled promise rejections
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      // Você pode enviar para um serviço de logging aqui
    });
  }

  // Handle errors
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      console.error('Global Error:', event.error);
      // Você pode enviar para um serviço de logging aqui
    });
  }
}

/**
 * Wrapper para funções assíncronas com tratamento de erro
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  defaultValue: T,
  errorMessage = 'An error occurred'
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(errorMessage, error);
    return defaultValue;
  }
}

/**
 * Wrapper para callbacks com tratamento de erro
 */
export function safeCallback<Args extends any[], Return>(
  fn: (...args: Args) => Return
): (...args: Args) => Return | null {
  return (...args: Args) => {
    try {
      return fn(...args);
    } catch (error) {
      console.error('Callback Error:', error);
      return null;
    }
  };
}
