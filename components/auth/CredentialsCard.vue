<template>
  <div class="bg-gray-900 bg-opacity-90 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-2xl max-w-sm">
    <div class="flex items-center mb-4">
      <InfoIcon class="h-6 w-6 text-blue-500 mr-3" />
      <h3 class="text-blue-400 font-bold text-lg">Credenciales de Acceso</h3>
    </div>

    <p class="text-gray-300 text-sm mb-6 leading-relaxed">
      Utiliza estas credenciales para acceder a la plataforma de demostración:
    </p>

    <div class="space-y-4">
      <div class="bg-gray-800 p-4 rounded-lg border border-gray-600">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-400 text-sm font-medium">Email:</span>
          <button
            @click="copyToClipboard('admin@moviehub.com', 'email')"
            class="text-gray-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <CheckIcon v-if="copiedField === 'email'" class="h-4 w-4 text-green-500" />
            <CopyIcon v-else class="h-4 w-4" />
          </button>
        </div>
        <p class="text-white font-mono text-sm break-all">admin@moviehub.com</p>
      </div>

      <div class="bg-gray-800 p-4 rounded-lg border border-gray-600">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-400 text-sm font-medium">Contraseña:</span>
          <button
            @click="copyToClipboard('admin123', 'password')"
            class="text-gray-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <CheckIcon v-if="copiedField === 'password'" class="h-4 w-4 text-green-500" />
            <CopyIcon v-else class="h-4 w-4" />
          </button>
        </div>
        <p class="text-white font-mono text-sm">admin123</p>
      </div>
    </div>

    <div class="mt-6 p-3 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-700">
      <p class="text-blue-300 text-xs leading-relaxed">
        💡 <strong>Tip:</strong> Puedes copiar las credenciales haciendo clic en el ícono de copiar o usar el botón de
        auto-completar en el formulario.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Info as InfoIcon, Copy as CopyIcon, Check as CheckIcon } from 'lucide-vue-next'

const copiedField = ref<string | null>(null)

const copyToClipboard = async (text: string, field: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedField.value = field
    setTimeout(() => {
      copiedField.value = null
    }, 2000)
  } catch (err) {
    console.error("Error al copiar:", err)
  }
}
</script>

<style scoped>
</style>
