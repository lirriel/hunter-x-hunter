<template>
    <div class="shadow p-3 mb-5 bg-white rounded">
        <div>
            <apexchart :options="chartOptions" :series="series" type="line"></apexchart>
        </div>
    </div>
</template>

<script>
    import VueApexCharts from 'vue-apexcharts'

    export default {
        name: "BasicChartBox",
        props: {
            chartOptions: Object,
            series: Array,
            type: String
        },
        components: {
            apexchart: VueApexCharts
        },
    }
</script>

<style scoped>

</style>