<template>
  <a-modal
    title="操作"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-steps :current="1">
      <a-step>
        <!-- <span slot="title">Finished</span> -->
        <template slot="title"> Finished </template>
        <span slot="description">This is a description.</span>
      </a-step>
      <a-step title="In Progress" description="This is a description." />
      <a-step title="Waiting" description="This is a description." />
    </a-steps>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from "vue";
import { message } from "ant-design-vue";
import { getPermissions } from "@/api/manage";
import pick from "lodash.pick";

export default defineComponent({
  name: "RoleModal",
  setup(props, { emit }) {
    const labelCol = {
      xs: { span: 24 },
      sm: { span: 5 },
    };
    const wrapperCol = {
      xs: { span: 24 },
      sm: { span: 16 },
    };
    const visible = ref(false);
    const confirmLoading = ref(false);
    const mdl = ref({});
    // form: this.$form.createForm(this),
    let permissions = [];
    function add() {
      edit({ id: 0 });
    }
    function edit(record) {
      mdl.value = Object.assign({}, record);
      visible.value = true;

      // 有权限表，处理勾选
      if (mdl.value.permissions && permissions) {
        // 先处理要勾选的权限结构
        const permissionsAction = {};
        mdl.value.permissions.forEach((permission) => {
          permissionsAction[permission.permissionId] =
            permission.actionEntitySet.map((entity) => entity.action);
        });
        // 把权限表遍历一遍，设定要勾选的权限 action
        permissions.forEach((permission) => {
          permission.selected = permissionsAction[permission.id] || [];
        });
      }
      nextTick(() => {
        // this.form.setFieldsValue(
        //   pick(this.mdl, "id", "name", "status", "describe")
        // );
      });
      console.log("this.mdl", mdl.value);
    }
    function close() {
      emit("close");
      visible.value = false;
    }
    function handleOk() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          console.log("form values", values);

          confirmLoading.value = true;
          // 模拟后端请求 2000 毫秒延迟
          new Promise((resolve) => {
            setTimeout(() => resolve(0), 2000);
          })
            .then(() => {
              // Do something
              message.success("保存成功");
              emit("ok");
            })
            .catch(() => {
              // Do something
            })
            .finally(() => {
              confirmLoading.value = false;
              close();
            });
        }
      });
    }
    function onChangeCheck(permission) {
      permission.indeterminate =
        !!permission.selected.length &&
        permission.selected.length < permission.actionsOptions.length;
      permission.checkedAll =
        permission.selected.length === permission.actionsOptions.length;
    }
    function handleCancel() {
      close();
    }
    function loadPermissions() {
      getPermissions().then((res) => {
        const result = res.data as [];
        permissions = result.map((permission) => {
          const options = JSON.parse(permission.actionData) || [];
          permission.checkedAll = false;
          permission.selected = [];
          permission.indeterminate = false;
          permission.actionsOptions = options.map((option) => {
            return {
              label: option.describe,
              value: option.action,
            };
          });
          return permission;
        });
      });
    }
    function onChangeCheckAll(e, permission) {
      Object.assign(permission, {
        selected: e.target.checked
          ? permission.actionsOptions.map((obj) => obj.value)
          : [],
        indeterminate: false,
        checkedAll: e.target.checked,
      });
    }
    // created
    loadPermissions();
    return {
      labelCol,
      wrapperCol,
      visible,
      confirmLoading,
      mdl,
      permissions,
      add,
      edit,
      close,
      handleOk,
      onChangeCheck,
      handleCancel,
      onChangeCheckAll,
      // form: this.$form.createForm(this),
    };
  },
});
</script>

<style scoped></style>
