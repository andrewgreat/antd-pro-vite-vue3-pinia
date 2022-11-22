<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('dashboard.analysis.total-sales')" total="￥126,560">
          <template #action>
            <a-tooltip :title="$t('dashboard.analysis.introduce')" >
              <InfoCircleOutlined />
            </a-tooltip>
          </template>
          <div>
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">{{ $t('dashboard.analysis.week') }}</span>
              12%
            </trend>
            <trend flag="down">
              <span slot="term">{{ $t('dashboard.analysis.day') }}</span>
              11%
            </trend>
          </div>
          <template #footer>{{ $t('dashboard.analysis.day-sales') }}<span> 234.56</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('dashboard.analysis.visits')" :total="NumberFormat(8846)">
          <template #action>
            <a-tooltip :title="$t('dashboard.analysis.introduce')" >
              <InfoCircleOutlined />
            </a-tooltip>
          </template>
          <div>
            <mini-area />
          </div>
          <template #footer>{{ $t('dashboard.analysis.day-visits') }}<span> {{ NumberFormat('1234')  }}</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('dashboard.analysis.payments')" :total="NumberFormat(6560)">
          <template #action>
            <a-tooltip :title="$t('dashboard.analysis.introduce')" >
              <InfoCircleOutlined />
            </a-tooltip>
          </template>
          <div>
            <mini-bar />
          </div>
          <template #footer>{{ $t('dashboard.analysis.conversion-rate') }} <span>60%</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('dashboard.analysis.operational-effect')" total="78%">
          <template #action>
          <a-tooltip :title="$t('dashboard.analysis.introduce')">
            <InfoCircleOutlined />
          </a-tooltip>
          </template>
          <div>
            <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" height="8px" />
          </div>
          <template #footer>
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">{{ $t('dashboard.analysis.week') }}</span>
              12%
            </trend>
            <trend flag="up">
              <span slot="term">{{ $t('dashboard.analysis.day') }}</span>
              80%
            </trend>
          </template>
        </chart-card>
      </a-col>
    </a-row>

    <a-card  :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <template #rightExtra>
            <div class="extra-wrapper" >
              <div class="extra-item">
                <a>{{ $t('dashboard.analysis.all-day') }}</a>
                <a>{{ $t('dashboard.analysis.all-week') }}</a>
                <a>{{ $t('dashboard.analysis.all-month') }}</a>
                <a>{{ $t('dashboard.analysis.all-year') }}</a>
              </div>
              <a-range-picker :style="{width: '256px'}" />
            </div>
          </template>
          <a-tab-pane loading="true" :tab="$t('dashboard.analysis.sales')" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar domId="chartBar1" :data="barData" :title="$t('dashboard.analysis.sales-trend')" >
                  <template #barArea >
                    <div id="chartBar1" :style="{ height: '100%' }"></div>
                  </template>
                </bar>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list :title="$t('dashboard.analysis.sales-ranking')" :list="rankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane :tab="$t('dashboard.analysis.visits')" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar domId="chartBar2" :data="barData2" :title="$t('dashboard.analysis.visits-trend')" >
                  <template #barArea >
                    <div id="chartBar2" :style="{ height: '100%' }"></div>
                  </template>
                </bar>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list :title="$t('dashboard.analysis.visits-ranking')" :list="rankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="!isMobile && 'desktop'">
      <a-row :gutter="24" type="flex" :style="{ marginTop: '24px' }">
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card :loading="loading" :bordered="false" :title="$t('dashboard.analysis.online-top-search')" :style="{ height: '100%' }">
            <template #extra>
              <a-dropdown :trigger="['click']" placement="bottomRight">
              <EllipsisOutlined />
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <span>{{ $t('dashboard.analysis.dropdown-option-one') }}</span>
                    </a-menu-item>
                    <a-menu-item>
                      <span>{{ $t('dashboard.analysis.dropdown-option-two') }}</span>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
            <a-row :gutter="68">
              <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 24px'}">
                <number-info :total="12321" :sub-total="17.1">
                  <template #subtitle>
                    <span>{{ $t('dashboard.analysis.search-users') }}</span>
                    <a-tooltip :title="$t('dashboard.analysis.introduce')">
                      <InfoCircleOutlined :style="{ marginLeft: '8px' }"/>
                    </a-tooltip>
                  </template>
                </number-info>
                <!-- miniChart -->
                <div>
                  <mini-smooth-area :style="{ height: '45px' }" domId="chartMiniSmoothArea1" :dataSource="searchUserData" >
                    <template #chart >
                      <div id="chartMiniSmoothArea1" :style="{ height: '8vh' }"></div>
                    </template>
                  </mini-smooth-area>
                </div>
              </a-col>
              <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 24px'}">
                <number-info :total="2.7" :sub-total="26.2" status="down">
                  <template #subtitle>
                    <span>{{ $t('dashboard.analysis.per-capita-search') }}</span>
                    <a-tooltip :title="$t('dashboard.analysis.introduce')" >
                      <InfoCircleOutlined :style="{ marginLeft: '8px' }"/>
                    </a-tooltip>
                  </template>
                </number-info>
                <!-- miniChart -->
                <div>
                  <mini-smooth-area :style="{ height: '45px' }" domId="chartMiniSmoothArea2" :dataSource="searchUserData2" >
                    <template #chart>
                      <div id="chartMiniSmoothArea2" class="chart-wrapper" :style="{ height: '8vh' }"></div>
                    </template>
                  </mini-smooth-area>
                </div>
              </a-col>
            </a-row>
            <div class="ant-table-wrapper">
              <a-table
                row-key="index"
                size="small"
                :columns="searchTableColumns"
                :dataSource="searchData"
                :pagination="{ pageSize: 5 }"
              >
                <template v-slot:bodyCell="{ column, text, record }">
                  <trend v-if="column.dataIndex === 'range'" :flag="record.status === 0 ? 'up' : 'down'">
                    <template #term>{{ text }}%</template>
                  </trend>
                </template>
              </a-table>
            </div>
          </a-card>
        </a-col>
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" :title="$t('dashboard.analysis.the-proportion-of-sales')" :style="{ height: '100%' }">
           <template #extra>
            <div style="height: inherit;">
              <!-- style="bottom: 12px;display: inline-block;" -->
              <span class="dashboard-analysis-iconGroup">
                <a-dropdown :trigger="['click']" placement="bottomLeft">
                  <EllipsisOutlined />
                  <template #overlay>
                    <a-menu>
                      <a-menu-item>
                        <a href="javascript:;">{{ $t('dashboard.analysis.dropdown-option-one') }}</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a href="javascript:;">{{ $t('dashboard.analysis.dropdown-option-two') }}</a>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </span>
              <div class="analysis-salesTypeRadio">
                <a-radio-group defaultValue="a">
                  <a-radio-button value="a">{{ $t('dashboard.analysis.channel.all') }}</a-radio-button>
                  <a-radio-button value="b">{{ $t('dashboard.analysis.channel.online') }}</a-radio-button>
                  <a-radio-button value="c">{{ $t('dashboard.analysis.channel.stores') }}</a-radio-button>
                </a-radio-group>
              </div>
            </div>
           </template>
            <div>
              <!-- style="width: calc(100% - 240px);" -->
              <div>
                <pie domId="chartPie" :data="pieData" :title="$t('dashboard.analysis.sales')" >
                  <template #pieArea >
                    <div id="chartPie" :style="{ height: '40vh' }"></div>
                  </template>
                </pie>
              </div>

            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, computed, ref, onMounted} from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs'
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  RankList,
  Bar,
  Pie,
  Trend,
  NumberInfo,
  MiniSmoothArea
} from '@/components/index'
import { appBase } from '@/store/app-base'
import DataSet from '@antv/data-set';
import userFormat from '@/utils/userFormat';

export default defineComponent({
  name: 'Analysis',
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Pie,
    Trend,
    NumberInfo,
    MiniSmoothArea
  },
  setup(){
    const { t } = useI18n()
    const loading = ref(true)
    const { isMobile } = appBase

    const { NumberFormat } =userFormat()

    const barData = []
    const barData2 = []
    for (let i = 0; i < 12; i += 1) {
      barData.push({
        x: `${i + 1}月`,
        y: Math.floor(Math.random() * 1000) + 200
      })
      barData2.push({
        x: `${i + 1}月`,
        y: Math.floor(Math.random() * 1000) + 200
      })
    }

    const rankList = []
    for (let i = 0; i < 7; i++) {
      rankList.push({
        name: '白鹭岛 ' + (i + 1) + ' 号店',
        total: 1234.56 - i * 100
      })
    }

    const searchUserData = []
    for (let i = 0; i < 7; i++) {
      searchUserData.push({
        x: dayjs().add(i, 'days').format('YYYY-MM-DD'),
        y: Math.ceil(Math.random() * 10)
      })
    }

    const searchUserData2 = []
    for (let i = 0; i < 7; i++) {
      searchUserData2.push({
        x: dayjs().add(i, 'days').format('YYYY-MM-DD'),
        y: Math.ceil(Math.random() * 10)
      })
    }

    const searchUserScale = [
      {
        dataKey: 'x',
        alias: '时间'
      },
      {
        dataKey: 'y',
        alias: '用户数',
        min: 0,
        max: 10
      }]

    const searchData = [] as Object[]
    for (let i = 0; i < 50; i += 1) {
      searchData.push({
        index: i + 1,
        keyword: `搜索关键词-${i}`,
        count: Math.floor(Math.random() * 1000),
        range: Math.floor(Math.random() * 100),
        status: Math.floor((Math.random() * 10) % 2)
      })
    }

    // const DataSet = require('@antv/data-set')

    const sourceData = [
      { item: '家用电器', count: 32.2 },
      { item: '食用酒水', count: 21 },
      { item: '个护健康', count: 17 },
      { item: '服饰箱包', count: 13 },
      { item: '母婴产品', count: 9 },
      { item: '其他', count: 7.8 }
    ]

    const pieStyle =  {
      stroke: '#fff',
        lineWidth: 1
    }

    const pieScale = [{
      dataKey: 'percent',
      min: 0,
      formatter: '.0%'
    }]

    const dv = new DataSet.View().source(sourceData)
    dv.transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent'
    })
    const pieData = dv.rows

    const searchTableColumns =computed(() => {
      return [
        {
          dataIndex: 'index',
          title: t('dashboard.analysis.table.rank'),
          width: 90
        },
        {
          dataIndex: 'keyword',
          title: t('dashboard.analysis.table.search-keyword')
        },
        {
          dataIndex: 'count',
          title: t('dashboard.analysis.table.users')
        },
        {
          dataIndex: 'range',
          title: t('dashboard.analysis.table.weekly-range'),
          align: 'right',
          sorter: (a, b) => a.range - b.range,
          scopedSlots: { customRender: 'range' }
        }
      ]
    })

    onMounted(()=>{setTimeout(() => {
      loading.value = !loading.value
    }, 1000)})


    return{
      loading,
      isMobile,
      NumberFormat,
      rankList,
      // 搜索用户数
      searchUserData,
      searchUserData2,
      searchUserScale,
      searchData,

      barData,
      barData2,

      //
      pieScale,
      pieData,
      sourceData,
      pieStyle,
      searchTableColumns
    }
  }

})

</script>

<style lang="less" scoped>
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  .antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;
  }

  .antd-pro-pages-dashboard-analysis-salesCard {
    height: calc(100% - 24px);
    :deep(.ant-card-head) {
      position: relative;
    }
  }

  .dashboard-analysis-iconGroup {
    i {
      margin-left: 16px;
      color: rgba(0,0,0,.45);
      cursor: pointer;
      transition: color .32s;
      color: black;
    }
  }
  .analysis-salesTypeRadio {
    position: absolute;
    right: 54px;
    bottom: 12px;
  }
</style>
