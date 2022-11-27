<template>
  <a-card :bordered="false">
    <component
      @onEdit="handleEdit"
      @onGoBack="handleGoBack"
      :record="record"
      :is="currentComponet"
    ></component>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";

// 动态切换组件
import List from "@/views/list/table/List.vue";
import Edit from "@/views/list/table/Edit.vue";

interface TableFields {
  id: string;
  callNo: number;
  status: number | undefined;
  description?: string;
  updatedAt: dayjs.Dayjs | undefined;
}

export default defineComponent({
  name: "TableListWrapper",
  components: {
    List,
    Edit,
  },
  setup() {
    const route = useRoute();
    const currentComponet = ref("List");
    const record = reactive<TableFields>({});

    const restRecord = function () {
      record.id = "";
      record.callNo = 0;
      record.status = undefined;
      record.description = "";
      record.updatedAt = undefined;
    };

    const handleEdit = function (rec) {
      restRecord();
      Object.assign(record, { ...rec, updatedAt: dayjs(rec.updatedAt) });
      currentComponet.value = "Edit";
    };
    const handleGoBack = function () {
      Object.assign(record, {});
      currentComponet.value = "List";
    };
    watch(
      () => route.path,
      () => {
        restRecord();
        currentComponet.value = "List";
      }
    );
    return {
      currentComponet,
      record,
      handleEdit,
      handleGoBack,
    };
  },
});
</script>
