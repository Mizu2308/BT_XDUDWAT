<template>
  <div class="card dashboard-chart">
    <div class="card-header flex align-items-center justify-content-between">
      <div class="card-title mb-0 fs-18">
        {{ $t("t-congestion") }}
      </div>
      <div class="flex align-items-center">
        <div>
          <i @click="onChangeDate('prev')" class="fs-18 icon-change-date mdi mdi-chevron-left"></i>
        </div>
        <flat-pickr
          v-model="date"
          :config="config"
          class="form-control flatpickr-input select-date-picker"
        ></flat-pickr>
        <div>
          <i @click="onChangeDate('next')" class="fs-18 icon-change-date mdi mdi-chevron-right"></i>
        </div>
      </div>
    </div>
    <!-- end card header -->
    <div class="card-body">
      <apexchart
        v-if="!loading"
        class="apex-charts mt-5"
        height="600"
        dir="ltr"
        ref="apex-chart"
        :series="series"
        :options="chartOptions"
        @zoomed="onZoomed"
        @scrolled="onScrolled"
        @beforeResetZoom="onBeforeResetZoom"
      ></apexchart>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { sensorLogsService } from "@/services/sensor-logs.service";
import flatPickr from "vue-flatpickr-component";

import "flatpickr/dist/flatpickr.css";
import { mapGetters } from "vuex";

export default {
  name: 'ChartDashboard',
  props: {
    dateDefault: {
      type: String,
      default: ''
    }
  },
  components: {
    flatPickr
  },
  data() {
    return {
      loading: false,
      chartData: [],
      params: {
        startDate: moment(new Date()).format('YYYY-MM-DD'),
        endDate: moment(new Date()).format('YYYY-MM-DD'),
      },
      date: moment(new Date()).format('YYYY-MM-DD'),
      config: {
        wrap: true,
        altFormat: "Y-m-d",
        altInput: true,
        dateFormat: "Y-m-d",
        disable: [
          function(date) {
            // return true to disable
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date > today;
          }
        ]
      },
      series: [],
      chartOptions: {
        chart: {
          type: "area",
          stacked: false,
          height: 600,
          redrawOnParentResize: true,
          zoom: {
            type: "x",
            enabled: true,
            autoScaleYaxis: true,
          },
        },
        dataLabels: {
          enabled: false, // Show labels for note
        },
        markers: {
          size: 0,
        },
        legend: {
          show: true,
          position: "top",
          horizontalAlign: "left",
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100],
          },
        },
        yaxis: {
          showAlways: true,
          min: 0,
          max: 120,
          tickAmount: 6,
          title: {
            style: {
              fontWeight: 500,
            },
          },
        },
        tooltip: {
          x: {
            formatter: function(val) {
              return moment(new Date(val)).format('HH:mm');
            },
          },
        },
        noData: {
          text: this.$t('t-no-data'),
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            fontSize: '14px',
            color: '#ced4da'
          }
        },
      },
    }
  },
  watch: {
    date: {
      handler() {
        this.$emit('onChangeDate', this.date);
        this.loadChartData();
      },
      deep: true
    },
    dateDefault: {
      handler() {
        if (this.dateDefault) {
          this.date = this.dateDefault;
        }
      },
      deep: true
    },
    '$route': function() {
      clearInterval(this.intervalRefreshData);
    },
    refreshData() {
      if (this.refreshData) {
        if (this.secondRefresh && (this.secondRefresh * 1 > 29)) {
          this.intervalRefreshData = setInterval(() => {
            this.loadChartData('refresh');
          }, this.secondRefresh * 1000);
        }
      } else {
        clearInterval(this.intervalRefreshData);
      }
    }
  },
  computed: {
    ...mapGetters({
      refreshData: 'settings/getRefreshData',
      secondRefresh: 'settings/getSeconds',
      currentUser: 'auth/currentUser',
    }),
  },
  mounted() {
    if (this.refreshData && this.secondRefresh && (this.secondRefresh * 1 > 29)) {
      this.intervalRefreshData = setInterval(() => {
        this.loadChartData('refresh');
      }, this.secondRefresh * 1000);
    } else {
      clearInterval(this.intervalRefreshData);
    }
    this.loadChartData();
  },
  methods: {
    onChangeDate(type) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (type === 'prev') {
        this.date = moment(new Date(this.date)).subtract(1, 'days').format('YYYY-MM-DD');
      } else {
        if (new Date(this.date) < today) {
          this.date = moment(new Date(this.date)).add(1, 'days').format('YYYY-MM-DD');
        }
      }
    },
    async loadChartData(type) {
      const vm = this;

      try {
        if (!type || type !== 'refresh') {
          this.loading = true;
        }
        let startDateUTC = moment(new Date(this.date)).set('hour', 0).set('minute', 0).utc().toISOString();
        let endDateUTC = moment(new Date(this.date)).set('hour', 23).set('minute', 59).utc().toISOString();
        this.params = {
          startDate: startDateUTC,
          endDate: endDateUTC,
        };
        let res = await sensorLogsService.getSensorLogsDashboard(this.params);
        this.chartData = res;
        if (res) {
          this.mappingChartData(res);
        }
        this.loading = false;

        setTimeout(() => {
          const apexChart = this.$refs['apex-chart'];
          if (apexChart) {
            apexChart.$el.querySelector('.exportCSV').replaceWith(apexChart.$el.querySelector('.exportCSV').cloneNode(true));
            apexChart.$el.querySelector('.exportCSV').removeEventListener('click', function(event) {}, true);
            apexChart.$el.querySelector('.exportCSV').addEventListener('click', function(event) {
              vm.exportCSV();
              event.preventDefault();
              event.stopPropagation();
              return;
            });
          }
        }, 0);

      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    exportCSV() {
      const vm = this;
      let csvData = [
      ];
      for (let index = 0; index < vm.chartData.length; index++) {
        const serie = vm.chartData[index];
        const datas = serie.logs;
        for (let index = 0; index < datas.length; index++) {
          const element = datas[index];
          const d = [
            moment(new Date(element.timestamp)).format("YYYY-MM-DD"),
            moment(new Date(element.timestamp)).format("HH:mm:ss"),
            vm.currentUser.facility.name,
            serie.roomName,
            element.currentPeopleCount,
          ];
          csvData = [ ...csvData, d ];
        }
      };

      csvData = csvData.sort(function(a, b) {
        return moment(a[1], 'HH:mm:ss') - moment(b[1], 'HH:mm:ss');
      });

      csvData = [
        [
          'YYYY-MM-DD',
          'HH:MM:SS',
          '施設名',
          '部屋',
          '室内人数'
        ],
        ...csvData
      ];

      let fileName = `${ vm.currentUser.facility.name }-${moment(new Date()).format("YYYYMMDDHHmmss")}`;
      let csvContent = "";
      csvData.forEach(function(serie) {
        let row = serie.join(",");
        csvContent += row + "\r\n";
      });

      let csv = document.createElement('a');
      csv.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
      csv.setAttribute('download', fileName);
      csv.click();

    },
    findNodeByInnerHTML(nodelist, innerHTML) {
      let notes = [];
      for (let index = 0; index < nodelist.length; index++) {
        const element = nodelist[index];
        const title = element.querySelector('title').innerHTML;
        if (title === innerHTML) {
          notes = [ ...notes, element]
        }
      }
      return notes;
    },
    onRemoveDuplicates() {
      const vm = this;
      const apexChart = this.$refs['apex-chart'];
      for (let index = 0; index < 24; index++) {
        let notes = vm.findNodeByInnerHTML(apexChart.$el.querySelectorAll('.apexcharts-xaxis-label'), `${index}${vm.$t('t-time')}`);
        if (notes && notes.length > 1) {
          for (let i = 1; i < notes.length; i++) {
            const e = notes[i];
            e.style.display = 'none';
          }
        }
      }
    },
    onBeforeResetZoom(chartContext, opts) {
      const vm = this;
      vm.chartOptions.xaxis.min = new Date(new Date(this.date).setHours(0, 0, 1, 1)).getTime(); 
      vm.chartOptions.xaxis.max = new Date(new Date(this.date).setHours(23, 59, 59, 999)).getTime(); 
      vm.chartOptions.xaxis.tickAmount = 24;

      vm.$refs['apex-chart'].updateOptions(vm.chartOptions);
      this.$refs['apex-chart'].refresh();
      this.onRemoveDuplicates();
      return;
    },
    onScrolled(chartContext, { xaxis }) {
      this.onRemoveDuplicates();
    },
    onZoomed(chartContext, { xaxis, yaxis }) {
      const vm = this;
      vm.chartOptions.xaxis.min = xaxis.min; 
      vm.chartOptions.xaxis.max = xaxis.max;

      const minhours = moment(xaxis.min).hours();
      const maxhours = moment(xaxis.max).hours();

      vm.chartOptions.xaxis.tickAmount = (maxhours * 1) - (minhours * 1);

      vm.$refs['apex-chart'].updateOptions(vm.chartOptions);

      vm.onRemoveDuplicates();

    },
    mappingChartData(data) {
      const vm = this;
      let times = [];
      let startOfDay = moment(this.date).startOf('day');
      let endOfDay = moment(this.date).endOf('day');
      let startOfDayNow = moment().startOf('day');
      let now = moment();

      for (let index = 0; index < data.length; index++) {
        const d = data[index];
        for (let index = 0; index < d.logs.length; index++) {
          const l = d.logs[index];
          let x = moment(new Date(l.timestamp)).format("YYYY-MM-DD HH:mm:ss");
          if (!times.includes(x)) {
            times = [ ...times, x ];
          }
          if (endOfDay < startOfDayNow) {
            if (!times.includes(endOfDay.format("YYYY-MM-DD HH:mm:ss"))) {
              times = [ ...times, endOfDay.format("YYYY-MM-DD HH:mm:ss") ];
            }
          } else {
            if (!times.includes(now.format("YYYY-MM-DD HH:mm:ss"))) {
              times = [ ...times, now.format("YYYY-MM-DD HH:mm:ss") ];
            }
          }
        }
      }

      // Sort times
      times.sort(function(a,b){
        return new Date(a) - new Date(b);
      });

      

      // Set start day into times
      if (!times.includes(startOfDay.format("YYYY-MM-DD HH:mm:ss"))) {
        const hours = moment(times[0]).hours();
        const minutes = moment(times[0]).minutes();
        let currentHour = moment(times[0]).set({hour:hours, minute: minutes, second:0, millisecond:0}).format('YYYY-MM-DD HH:mm:ss');
        if (!times.includes(currentHour)) {
          times = [ currentHour, ...times ];
        }

        times = [ startOfDay.format("YYYY-MM-DD HH:mm:ss"), ...times ];
      }

      let series = data.map(d => {
      let data = [];
      // let capacity = d?.capacity || 0;

      for (let index = 0; index < times.length; index++) {
        const time = times[index];

        let log = d.logs.find(log => moment(new Date(log.timestamp)).format("YYYY-MM-DD HH:mm:ss") === time);
          if (log) {
            let percentage = log?.congestionPercentage || 0;
            percentage = parseInt(Math.round(percentage));
            let item = {
              x: time,
              y: percentage * 1,
              percentage: percentage * 1,
              currentPeopleCount: log.currentPeopleCount,
            }
            data = [...data, item];
          } else {
            let prevLog = d.logs.filter(function(log) {
              return new Date(log.timestamp) < new Date(time);
            });
            let y = 0;
            let prevLogData = null;
            if (prevLog && prevLog.length > 0) {
              y = prevLog[prevLog.length - 1].currentPeopleCount;
              prevLogData = prevLog[prevLog.length - 1];
            }

            let percentage = prevLogData?.congestionPercentage || 0;
            percentage = parseInt(Math.round(percentage));

            let item = {
              x: time,
              y: percentage * 1,
              percentage: percentage * 1,
              currentPeopleCount: y
            }
            data = [...data, item];
          }
        }
        return {
          name: d.roomName,
          data: data
        }
      });

      vm.series = series;
      
      let xaxis = {
        tickAmount: 24,
        type: 'datetime',
        min: new Date(new Date(this.date).setHours(0, 0, 1, 1)).getTime(),
        max: new Date(new Date(this.date).setHours(23, 59, 59, 999)).getTime(),
        labels: {
          show: true,
          formatter: function(val, timestamp) {
            return `${moment(new Date(timestamp)).format("H")}${vm.$t('t-time')}`; // formats to hours:minutes
          }        
        }
      }
      vm.chartOptions.xaxis = xaxis;

      vm.chartOptions.tooltip = {
        custom: function({seriesIndex, dataPointIndex, w}) {
          let data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
          let cart = ``;
          for (let index = 0; index < w.globals.initialSeries.length; index++) {
            const element = w.globals.initialSeries[index];
            let percentage = element.data[dataPointIndex]?.percentage || 0;
            let currentPeopleCount = element.data[dataPointIndex]?.currentPeopleCount || 0;
            percentage = percentage * 1;
            const color = w.globals.colors[index];
            const colorInfo = percentage < 40 ? 'bg-info' : (percentage < 60 && percentage >= 40) ? 'bg-success' : (60 <= percentage && percentage < 80) ? 'bg-warning' : 'bg-danger';
            const textInfo = percentage < 40 ? '空いてる' : (percentage < 60 && percentage >= 40) ? '比較的空いてる' : (60 <= percentage && percentage < 80) ? '少し混雑' : '混雑';
            cart += `<div class="row chart-tooltip mt-1">
              <div class="col-md-5 d-flex align-items-center">
                <div style="background-color: ${color}; width: 10px; height: 10px;border-radius: 50%"></div>
                <div class="ml-2 chart-tooltip-name">
                  ${element.name}
                </div>
              </div>
              <div class="col-md-4 fs-14">
                ${currentPeopleCount}${vm.$t('t-name2')}
                ${percentage}%
              </div>
              <div class="col-md-3 text-white chart-tooltip-info ${colorInfo}">
                ${textInfo}
              </div>
            </div>`
          }

          return `
            <div class="card px-1 py-1 mb-0">
              <div class="card-header px-1 py-1 fs-12">${ moment(data.x).format('YYYY-MM-DD HH:mm') }</div>
              <div class="card-body px-1 py-1">
                ${cart}
              </div>
            </div>
          `;
        }
      };

      let toolbar = {
        autoSelected: "zoom",
        tools: { download: true, selection: true, zoom: true, zoomin: true, zoomout: true, pan: true, reset: true },
        show: true,
        export: {
          csv: {
            filename: `${ vm.currentUser.facility.name }-${moment(new Date()).format("YYYYMMDDHHmmss")}`,
            headerCategory: 'Timestamp',
            enabled: false,
            dateFormatter(val) {
              return `${moment(new Date(val)).format("YYYY-MM-DD HH:mm:ss")}`;
            }
          },
          svg: {
            filename: `${ vm.currentUser.facility.name }-${moment(new Date()).format("YYYYMMDDHHmmss")}`,
          },
          png: {
            filename: `${ vm.currentUser.facility.name }-${moment(new Date()).format("YYYYMMDDHHmmss")}`,
          },
        }
      };

      vm.chartOptions.chart.toolbar = toolbar;

      

    }
  },
  beforeRouteEnter (to, from, next) {
    console.log(to, from, next);
  }
}
</script>

<style lang="scss">
  .dashboard-chart {
    .select-date-picker {
      width: 110px;
      background-color: #eff4fc;
      color: #6691e3;
      border-color: #eff4fc;
    }

    .icon-change-date {
      color: #6691e3;
      cursor: pointer;
    }
    .chart-tooltip {
      font-size: 14px;
      color: #878a99;
      width: 350px;
    }
    .chart-tooltip-info {
      width: 75px;
      height: 20px;
      text-align: center;
      font-size: 10px;
      color: #ffffff !important;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chart-tooltip-name {
      // max-width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
    }
  }
</style>