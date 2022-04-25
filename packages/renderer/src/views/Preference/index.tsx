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
} from 'naive-ui';
import type { UploadProps } from 'naive-ui/lib/upload';

import './index.scss';
import { uploadFile } from '../../services';
import { useUserStore } from '../../store';

const Login = defineComponent({
  setup() {
    onMounted(() => {});

    const userSetup = useUserStore();
    const { preference } = storeToRefs(userSetup);
    const submitLoading = ref(false);
    const msger = useMessage();
    const router = useRouter();
    const fileList = ref<UploadFileInfo[]>([
      {
        url:
          preference.value.avatarUrl ||
          'https://avatars0.githubusercontent.com/u/9183485?s=200&v=4',
        id: 'avatar',
        name: 'avatar',
        status: 'finished',
      },
    ]);

    const handleSave = () => {};

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
            preference.value.avatarUrl = url;
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
      preference,
      fileList,
      handleSave,
      handleUploadFile,
    };
  },
  render() {
    const {
      submitLoading,
      handleSave,
      handleUploadFile,
      preference,
      fileList,
    } = this;
    return (
      <div class="preference-wrapper">
        <NCard bordered={false}>
          <NForm ref="signin" model={preference}>
            <NFormItemRow label="头像" path="avatarUrl">
              <NUpload
                max={1}
                onBeforeUpload={handleUploadFile}
                defaultFileList={fileList}
                list-type="image-card"
              ></NUpload>
            </NFormItemRow>
            <NFormItemRow label="手机号" path="mobile">
              <NInput
                // v-model:value={loginValue.mobile}
                placeholder="请输入手机号"
              />
            </NFormItemRow>

            <NFormItemRow label="密码" path="password">
              <NInput
                type="password"
                // v-model:value={loginValue.password}
                placeholder="请输入密码"
              />
            </NFormItemRow>
          </NForm>
          <NButton
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
