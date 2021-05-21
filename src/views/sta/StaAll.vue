<template>
    <el-row>
      <el-col :xs="24" :sm="12" :md="12" :lg="10">
        <div id="pie" style="width:100%;height:400px;padding-top:40px"></div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="13">
        <div id="bar" style="width:110%;height:400px;padding-top:40px"></div>
      </el-col>
    </el-row>
</template>

<script>
  export default {
    name: "StaAll",
    data() {
      return {
      }
    },mounted() {
      this.initPie();
      window.onresize = () => {
        let pieChart = this.$echarts.init(document.getElementById('pie'))
        let barChart = this.$echarts.init(document.getElementById('bar'))
        pieChart.resize();
        barChart.resize();
      }
    },
    methods: {
      initPie() {
        let pieChart = this.$echarts.init(document.getElementById('pie'))
        let barChart = this.$echarts.init(document.getElementById('bar'))
        this.getRequest('/salary/sob/').then(resp => {
          if (resp) {
            resp.forEach(item => {
              option.series[0].data.push({name: item.name, value: item.basicSalary})
            })
            pieChart.setOption(option);
            const name = resp.map(value => value.name)
            barOption.xAxis.data = name
            const basicSalary = resp.map(value => value.basicSalary)
            barOption.series[0].data = basicSalary
            barChart.setOption(barOption);
          }
        })
        const option = {
          title: {
            text: '饼状图'
          },
          legend: {
            top: 'bottom'
          },
          tooltip: {
            trigger: 'item'
          },
          toolbox: {
            show: true,
            // feature: {
            //   mark: {show: true},
            //   dataView: {show: true, readOnly: false},
            //   restore: {show: true},
            //   saveAsImage: {show: true}
            // }
          },
          series: [
            {
              name: '面积模式',
              type: 'pie',
              radius: '55%',
              data: []
            }
          ]
        };
        const barOption = {
          title: {
            text: '柱状图'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            top: 'top'
          },
          xAxis: {
            type: 'category',
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '基本工资',
              data: [],
              type: 'bar',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
            }
          ]
        };
      }
    }
  }
</script>

<style scoped>

</style>