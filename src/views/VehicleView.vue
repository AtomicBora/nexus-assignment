<script setup lang="ts">
import type { VehicleMakes, VehicleModels, VehicleYears } from '@/@types/Vehicle'
import type { VSelect } from '@/@types/VSelect'
import { assertIsDefined } from '@/shared/useAssert'
import { useFetchData } from '@/shared/useFetchData'
import { ref, watch } from 'vue'

const apiToken = import.meta.env.VITE_API_TOKEN
assertIsDefined(apiToken)

const availableVehicleYears = ref<VSelect<number>[] | []>([])
const availableVehicleMakes = ref<VSelect<string>[] | []>([])
const availableVehicleModels = ref<VSelect<string>[] | []>([])
const selectedVehicleYear = ref<{ value: number; label: string } | null>(null)
const selectedVehicleMake = ref<{ value: string; label: string } | null>(null)
const selectedVehicleModel = ref<{ value: string; label: string } | null>(null)

const {
  fetchData: fetchYears,
  data: years,
  loading: yearsLoading,
  error: yearsError,
} = useFetchData<VehicleYears[]>(`/api/v2/vehicles/years/?token=${apiToken}`)

fetchYears()

watch(years, () => {
  if (!years.value) {
    availableVehicleYears.value = []
    selectedVehicleYear.value = null
    return
  }
  availableVehicleYears.value = years.value.map(({ year }) => {
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
    `/api/v2/vehicles/models/?year=${year.value}&make=${make.value}&token=${apiToken}`,
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
      />
      <div class="select-container">
        <v-select
          :disabled="!selectedVehicleYear"
          v-model="selectedVehicleMake"
          :options="availableVehicleMakes"
          placeholder="Select Make"
        />
      </div>
      <div class="select-container">
        <v-select
          :disabled="!selectedVehicleYear || !selectedVehicleMake"
          v-model="selectedVehicleModel"
          :options="availableVehicleModels"
          placeholder="Select Model"
        />
      </div>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .select-container {
    width: 300px;
    margin: 10px 0;
  }
}
</style>
