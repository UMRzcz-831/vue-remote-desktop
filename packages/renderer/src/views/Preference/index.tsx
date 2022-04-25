import { defineComponent, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import {
  NUpload,
  NCard,
  NForm,
  NFormItemRow,
  NInput,
  NButton,
  FormRules,
  FormInst,
  useMessage,
  UploadFileInfo,
  NSwitch,
} from 'naive-ui';
import type { UploadProps } from 'naive-ui/lib/upload';

import './index.scss';
import { updatePreference, uploadFile } from '../../services';
import { useUserStore } from '../../store';

const Login = defineComponent({
  setup() {
    onMounted(() => {});

    const userSetup = useUserStore();
    const { preference } = userSetup;
    const editValue = ref({ ...preference });
    const submitLoading = ref(false);
    const msger = useMessage();
    const router = useRouter();
    const fileList = ref<UploadFileInfo[]>([
      {
        url:
          editValue.value.avatarUrl ||
          'https://avatars0.githubusercontent.com/u/9183485?s=200&v=4',
        id: 'avatar',
        name: 'avatar',
        status: 'finished',
      },
    ]);

    const handleSave = async () => {
      submitLoading.value = true;
      try {
        const { success, msg } = await updatePreference(editValue.value);
        submitLoading.value = false;
        if (success) {
          msger.success(msg);
          await userSetup.reqUserInfo();
          // router.push('/');
        } else {
          msger.error(msg);
        }
      } catch (error) {
        submitLoading.value = false;
        throw error;
      }
    };

    const handleUploadFile: UploadProps['onBeforeUpload'] = async ({
      file,
    }) => {
      const formData = new FormData();
      if (file.file) {
        formData.append('file', file.file);
        try {
          const { success, msg, data } = await uploadFile(formData);
          if (success) {
            const { url } = data;
            editValue.value.avatarUrl = url;
          } else {
            msger.error(msg);
          }
        } catch (error) {
          throw error;
        }
      }
    };

    return {
      submitLoading,
      editValue,
      fileList,
      handleSave,
      handleUploadFile,
    };
  },
  render() {
    const { submitLoading, handleSave, handleUploadFile, editValue, fileList } =
      this;
    return (
      <div class="preference-wrapper">
        <NCard bordered={false}>
          <NForm ref="signin" model={editValue} labelPlacement="left">
            <NFormItemRow label="头像" path="avatarUrl">
              <NUpload
                max={1}
                onBeforeUpload={handleUploadFile}
                defaultFileList={fileList}
                list-type="image-card"
              ></NUpload>
            </NFormItemRow>
            <NFormItemRow label="昵称" path="nickname">
              <NInput
                v-model:value={editValue.nickname}
                placeholder="请输入昵称"
              />
            </NFormItemRow>

            <NFormItemRow label="主题" path="theme">
              <NSwitch
                v-model:value={editValue.theme}
                checkedValue="1"
                uncheckedValue="0"
                round={false}
                v-slots={{
                  checked: () => '深夜模式',
                  unchecked: () => '白昼模式',
                }}
              ></NSwitch>
            </NFormItemRow>
          </NForm>
          <NButton
            class="save-button"
            type="primary"
            block
            secondary
            strong
            onClick={handleSave}
            loading={submitLoading}
          >
            保存
          </NButton>
        </NCard>
      </div>
    );
  },
});

export default Login;
