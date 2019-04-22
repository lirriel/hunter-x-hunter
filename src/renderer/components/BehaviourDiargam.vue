<template>
    <b-row>
        <b-col sm="3"></b-col>
        <b-col sm="9">
            <h4>System behaviour</h4>
            <div>
                <apexchart :options="chartOptions" :series="series" type="area" width="700"></apexchart>
            </div>
        </b-col>
    </b-row>
</template>

<script>
    import VueApexCharts from 'vue-apexcharts'
    export default {
        name: "BehaviourDiargam",
        props: {
            series: Array,
        },
        components: {
          apexchart: VueApexCharts
        },
        data() {
            return {
                chartOptions: {
                    chart: {
                        zoom: {
                            enabled: true
                        },
                    },
                    dataLabels: {
                        enabled: false
                    },
                    xaxis: {
                        categories: this.timeArray
                    },
                    stroke: {
                        curve: "smooth"
                    },
                },
            }
        }
    }
</script>

<style scoped>

</style>