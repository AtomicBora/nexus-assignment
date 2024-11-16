<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useVehiclesStore } from '../stores/vehicles'
import { useFetchData } from '@/shared/useFetchData'
import type { VehicleMakes, VehicleModels, VehicleYears } from '@/@types/Vehicle'
import { onMounted, watch } from 'vue'

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
} = useFetchData<VehicleYears>('/api/vehicles/years')

fetchYears()

onMounted(async () => {
  if (selectedVehicleYear.value?.value) {
    const { fetchData: fetchMakes, data: availableMakes } = useFetchData<VehicleMakes>(
      `/api/vehicles/makes?year=${selectedVehicleYear.value.value}`,
    )

    await fetchMakes()

    if (!availableMakes.value) {
      availableVehicleMakes.value = []
      return
    }

    availableVehicleMakes.value = availableMakes.value.data.map((vehicle) => {
      return { value: vehicle.name, label: vehicle.name }
    })
  }

  if (selectedVehicleYear.value && selectedVehicleMake.value) {
    const { fetchData: fetchModels, data: availableModels } = useFetchData<VehicleModels>(
      `/api/vehicles/models?year=${selectedVehicleYear.value.value}&make=${selectedVehicleMake.value.value}`,
    )

    await fetchModels()

    if (!availableModels.value) {
      availableVehicleModels.value = []
      return
    }

    availableVehicleModels.value = availableModels.value.data.map((vehicle) => {
      return { value: vehicle.model, label: vehicle.model }
    })
  }
})

watch(availableYears, async () => {
  if (!availableYears.value?.data.length) {
    availableVehicleYears.value = []
    return
  }

  availableVehicleYears.value = availableYears.value.data.map((year) => {
    return { value: year, label: year.toString() }
  })
})

watch(selectedVehicleYear, async () => {
  if (!selectedVehicleYear.value) {
    availableVehicleMakes.value = []
    selectedVehicleMake.value = null
    availableVehicleModels.value = []
    selectedVehicleModel.value = null
    return
  }

  const { fetchData: fetchMakes, data: availableMakes } = useFetchData<VehicleMakes>(
    `/api/vehicles/makes/?year=${selectedVehicleYear.value.value}`,
  )

  await fetchMakes()

  if (!availableMakes.value) {
    availableVehicleMakes.value = []
    return
  }

  availableVehicleMakes.value = availableMakes.value.data.map((vehicle) => {
    return { value: vehicle.name, label: vehicle.name }
  })

  if (!availableVehicleMakes.value.some((avm) => avm.value === selectedVehicleMake.value?.value)) {
    selectedVehicleMake.value = null
  }
})

watch([selectedVehicleYear, selectedVehicleMake], async ([year, make]) => {
  if (!year || !make) {
    availableVehicleModels.value = []
    selectedVehicleModel.value = null
    return
  }

  const { fetchData: fetchModels, data: availableModels } = useFetchData<VehicleModels>(
    `/api/vehicles/models?year=${year.value}&make=${make.value}`,
  )

  await fetchModels()

  if (!availableModels.value) {
    availableVehicleModels.value = []
    return
  }

  availableVehicleModels.value = availableModels.value.data.map((vehicle) => {
    return { value: vehicle.model, label: vehicle.model }
  })

  if (
    !availableVehicleModels.value.some((model) => model.value === selectedVehicleModel.value?.value)
  ) {
    selectedVehicleModel.value = null
  }
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
