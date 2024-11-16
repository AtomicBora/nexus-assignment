import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { VSelect } from '@/@types/VSelect'

export const useVehiclesStore = defineStore('vehicles', () => {
  const availableVehicleYears = ref<VSelect<number>[] | []>([])
  const availableVehicleMakes = ref<VSelect<string>[] | []>([])
  const availableVehicleModels = ref<VSelect<string>[] | []>([])
  const selectedVehicleYear = ref<{ value: number; label: string } | null>(null)
  const selectedVehicleMake = ref<{ value: string; label: string } | null>(null)
  const selectedVehicleModel = ref<{ value: string; label: string } | null>(null)

  return {
    availableVehicleMakes,
    availableVehicleYears,
    availableVehicleModels,
    selectedVehicleYear,
    selectedVehicleMake,
    selectedVehicleModel,
  }
})
