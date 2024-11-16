<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useVehiclesStore } from '../stores/vehicles'
import { useFetchData } from '@/shared/useFetchData'
import type { VehicleMakes, VehicleModels, VehicleYears } from '@/@types/Vehicle'
import { watch } from 'vue'
import { assertIsDefined } from '@/shared/useAssert'

const apiToken = import.meta.env.VITE_API_TOKEN
assertIsDefined(apiToken)

const vehicleStore = useVehiclesStore()

const {
  availableVehicleYears,
  availableVehicleMakes,
  availableVehicleModels,
  selectedVehicleYear,
  selectedVehicleMake,
  selectedVehicleModel,
} = storeToRefs(vehicleStore)

const {
  fetchData: fetchYears,
  data: availableYears,
  error: yearsError,
  loading: yearsLoading,
} = useFetchData<VehicleYears[]>(`/api/v2/vehicles/years/?token=${apiToken}`)

fetchYears()

watch(availableYears, async () => {
  if (!availableYears.value) {
    availableVehicleYears.value = []
    return
  }

  availableVehicleYears.value = availableYears.value.map((vehicle) => {
    return { value: vehicle.year, label: vehicle.year.toString() }
  })

  if (selectedVehicleYear.value) {
    const { fetchData: fetchMakes, data: availableMakes } = useFetchData<VehicleMakes[]>(
      `/api/v2/vehicles/makes/?year=${selectedVehicleYear.value.value}&token=${apiToken}`,
    )
    await fetchMakes()

    if (!availableMakes.value) {
      availableVehicleMakes.value = []
      return
    }

    availableVehicleMakes.value = availableMakes.value.map((vehicle) => {
      return { value: vehicle.make, label: vehicle.make }
    })
  }
})

watch(selectedVehicleYear, async () => {
  if (!selectedVehicleYear || !selectedVehicleYear.value) {
    availableVehicleMakes.value = []
    selectedVehicleMake.value = null
    availableVehicleModels.value = []
    selectedVehicleModel.value = null
    return
  }

  const { fetchData: fetchMakes, data: availableMakes } = useFetchData<VehicleMakes[]>(
    `/api/v2/vehicles/makes/?year=${selectedVehicleYear.value.value}&token=${apiToken}`,
  )

  await fetchMakes()

  if (!availableMakes.value) {
    availableVehicleMakes.value = []
    return
  }

  availableVehicleMakes.value = availableMakes.value.map((vehicle) => {
    return { value: vehicle.make, label: vehicle.make }
  })
})

watch([selectedVehicleYear, selectedVehicleMake], async ([year, make]) => {
  if (!year || !make) {
    availableVehicleModels.value = []
    selectedVehicleModel.value = null
    return
  }

  const { fetchData: fetchModels, data: availableModels } = useFetchData<VehicleModels[]>(
    `/api/v2/vehicles/models/?year=${year.value}&make=${make.value}&token=5cbe12fb62f4941267d623499a2a4fd5948fd3ef`,
  )

  await fetchModels()

  if (!availableModels.value) {
    availableVehicleModels.value = []
    return
  }

  availableVehicleModels.value = availableModels.value.map((vehicle) => {
    return { value: vehicle.model, label: vehicle.model }
  })
})
</script>

<template>
  <div class="container">
    <h1>Select Vechicle Year/Make/Model</h1>
    <div v-if="yearsLoading">Loading...</div>
    <div v-else-if="yearsError">Error: {{ yearsError }}</div>
    <div v-else class="select-container">
      <v-select
        v-model="selectedVehicleYear"
        :options="availableVehicleYears"
        placeholder="Select Year"
        style="width: 100%"
      />
      <div class="select-container">
        <v-select
          :disabled="!selectedVehicleYear"
          v-model="selectedVehicleMake"
          :options="availableVehicleMakes"
          placeholder="Select Make"
          style="width: 100%"
        />
      </div>
      <div class="select-container">
        <v-select
          :disabled="!selectedVehicleYear || !selectedVehicleMake"
          v-model="selectedVehicleModel"
          :options="availableVehicleModels"
          placeholder="Select Model"
          style="width: 100%"
        />
      </div>
    </div>
  </div>
</template>
