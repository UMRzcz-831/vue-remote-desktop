import { defineComponent, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import {
  NDivider,

  NForm,
  NFormItem,
  NInput,
} from 'naive-ui';
import './index.scss';
import { isEmpty } from 'lodash';

const Home = defineComponent({
  setup() {
    onMounted(() => {
      // gethome();
    });

    return () => (
      <div class="home-wrapper">
        <div class="local-info">
          <NDivider title-placement="left">
            <div class="local-info-title">允许控制本机</div>
          </NDivider>
          <div class="local-info-content">
            <NForm label-width="auto" size="large">
              <NFormItem label="本机识别码">
                <div class="local-info-local-id">
                  <span>
                    {'478418376'.replace(/\s/g, '').replace(/(.{3})/g, '$1 ')}
                  </span>
                </div>
              </NFormItem>
            </NForm>
            <NForm label-width="auto" size="large" show-feedback={false}>
              <NFormItem label="本机验证码">
                <div class="local-info-local-code">
                  <span>2aJBn0</span>
                </div>
              </NFormItem>
            </NForm>
          </div>
        </div>
        <div class="remote-info">
          <NDivider title-placement="left">
            <div class="remote-info-title">远程控制设备</div>
          </NDivider>
          <div class="remote-info-content">
            <NForm label-width="auto" size="large">
              <NFormItem label="远程主机识别码">
                <div class="remote-info-local-id">
                  <NInput placeholder="输入识别码"></NInput>
                </div>
              </NFormItem>
            </NForm>
          </div>
        </div>
      </div>
    );
  },
});

export default Home;
