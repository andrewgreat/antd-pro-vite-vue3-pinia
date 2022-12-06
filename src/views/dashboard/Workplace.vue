<template>
  <page-header-wrapper>
    <template #content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar size="large" :src="currentUser.avatar" />
        </div>
        <div class="content">
          <div class="content-title">
            {{ tf }}，{{ currentUser.nickname
            }}<span class="welcome-text">，{{ welcome }}</span>
          </div>
          <div>前端工程师 | 蚂蚁金服 - 某某某事业群 - VUE平台</div>
        </div>
      </div>
    </template>
    <template #extraContent>
      <div class="extra-content">
        <div class="stat-item">
          <a-statistic title="项目数" :value="56" />
        </div>
        <div class="stat-item">
          <a-statistic title="团队内排名" :value="8" suffix="/ 24" />
        </div>
        <div class="stat-item">
          <a-statistic title="项目访问" :value="2223" />
        </div>
      </div>
    </template>

    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="project-list"
            :loading="loading"
            style="margin-bottom: 24px"
            :bordered="false"
            title="进行中的项目"
            :body-style="{ padding: 0 }"
          >
            <template #extra>
              <a>全部项目</a>
            </template>

            <div>
              <a-card-grid
                class="project-card-grid"
                :key="i"
                v-for="(item, i) in projects"
              >
                <a-card :bordered="false" :body-style="{ padding: 0 }">
                  <a-card-meta
                    :title="item.title"
                    :description="item.description"
                  >
                    <template #avatar>
                      <a-avatar :src="item.cover" />
                    </template>
                  </a-card-meta>
                  <div class="project-item">
                    <a href="/#/">科学搬砖组</a>
                    <span class="datetime">9小时前</span>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>

          <a-card :loading="loading" title="动态" :bordered="false">
            <a-list>
              <a-list-item :key="index" v-for="(item, index) in activities">
                <a-list-item-meta>
                  <template #avatar>
                    <a-avatar size="small" :src="item.user.avatar" />
                  </template>
                  <template #title>
                    <span>{{ item.user.nickname }}</span
                    >&nbsp;在<a href="#">{{ item.project.name }}</a
                    >&nbsp;<span>{{ item.project.action }}</span
                    >&nbsp;
                    <a href="#">{{ item.project.event }}</a>
                  </template>
                  <template #description>{{ item.time }}</template>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24"
        >
          <a-card
            title="快速开始 / 便捷导航"
            style="margin-bottom: 24px"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <div class="item-group">
              <a>操作一</a>
              <a>操作二</a>
              <a>操作三</a>
              <a>操作四</a>
              <a>操作五</a>
              <a>操作六</a>
              <a-button type="primary" size="small" ghost>
                <template #icon> <PlusOutlined /> </template>添加
              </a-button>
            </div>
          </a-card>
          <a-card
            title="XX 指数"
            style="margin-bottom: 24px"
            :loading="radarLoading"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <div style="min-height: 400px">
              <!-- :scale="scale" :axis1Opts="axis1Opts" :axis2Opts="axis2Opts"  -->
              <radar :data="radarData" />
            </div>
          </a-card>
          <a-card :loading="loading" title="团队" :bordered="false">
            <div class="members">
              <a-row>
                <a-col :span="12" v-for="(item, index) in teams" :key="index">
                  <a>
                    <a-avatar size="small" :src="item.avatar" />
                    <span class="member">{{ item.name }}</span>
                  </a>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, ref, onMounted } from "vue";
import DataSet from "@antv/data-set";
import { useUserStore } from "@/store/modules/user";
import { timeFix } from "@/utils/util";
import { Radar } from "@/components/index";

import { getRoleList, getServiceList } from "@/api/manage";
import { requestGet } from "@/api/service";

interface Project {
  id: Number;
  cover: String;
  title: String;
  description: String;
  status: Number;
  updatedAt: String;
}
interface Activity {
  id: Number;
  user: {
    nickname: String;
    avatar: String;
  };
  project: {
    name: String;
    action: String;
    event: String;
  };
  time: String;
}

interface team {
  id: Number;
  name: String;
  avatar: String;
}

export default defineComponent({
  name: "Workplace",
  components: {
    Radar,
  },
  setup() {
    const tf = timeFix();
    const userStore = useUserStore();
    const userInfo = computed(() => {
      return userStore.info;
    });

    const user = userStore.info;

    const projects = reactive<Project[]>([]);
    const loading = ref(true);
    const radarLoading = ref(true);
    const activities = reactive<Activity[]>([]);
    const teams = ref(<team[]>[]);

    const radarData = <Object[]>[];
    const welcome =ref(userStore.welcome);

    const currentUser = reactive( {
      nickname: userStore.nickname,
        avatar: userStore.avatar,
      });


    const getProjects = () => {
      requestGet("/api/list/search/projects").then((res) => {
        projects.push(...(res.data && res.data.data));
        loading.value = false;
      });
    };
    const getActivity = () => {
      requestGet("/api/workplace/activity").then((res) => {
        activities.push(...res.data);
      });
    };
    const getTeams = () => {
      requestGet("/api/workplace/teams").then((res) => {
        teams.value = res.data;
      });
    };
    const initRadar = () => {
      radarLoading.value = true;

      requestGet("/api/workplace/radar").then((res) => {
        const ds = new DataSet();
        const dv = ds.createView().source(res.data);
        dv.transform({
          type: "fold",
          fields: ["个人", "团队", "部门"],
          key: "user",
          value: "score",
        });

        radarData.push(...res.data);
        radarLoading.value = false;
      });
    };

    getRoleList(0).then((res) => {
      // console.log('workplace -> call getRoleList()', res)
    });

    getServiceList(0).then((res) => {
      // console.log('workplace -> call getServiceList()', res)
    });

    onMounted(() => {
      getProjects();
      getActivity();
      getTeams();
      initRadar();
    });

    return {
      tf,
      user,
      projects,
      loading,
      radarLoading,
      activities,
      teams,
      radarData,
      welcome,
      currentUser,
      userInfo,
    };
  },
});
</script>

<style lang="less" scoped>
@import "./Workplace.less";

.project-list {
  .card-title {
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.85);
      margin-left: 12px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .card-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }

  .project-item {
    display: flex;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    height: 20px;
    line-height: 20px;

    a {
      color: rgba(0, 0, 0, 0.45);
      display: inline-block;
      flex: 1 1 0;

      &:hover {
        color: #1890ff;
      }
    }

    .datetime {
      color: rgba(0, 0, 0, 0.25);
      flex: 0 0 auto;
      float: right;
    }
  }

  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;

  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;
  }
}

.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;

    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }

    &:hover {
      span {
        color: #1890ff;
      }
    }
  }
}

.mobile {
  .project-list {
    .project-card-grid {
      width: 100%;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 16px 0 16px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }
}
</style>
