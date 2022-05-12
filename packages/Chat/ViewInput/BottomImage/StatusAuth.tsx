import {IStatusPhotos, ProviderChat} from '@/ChatProvider/Provider';
import {ITheme} from '@/ChatProvider/theme';
import Text from '@/lib/Text';
import bar from '@/utils/bar';
import {colorLink} from '@/utils/variables';
import React, {Component} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

interface IProps {
  status: IStatusPhotos;
  requestAuthorPhotos: () => any;
}

class StatusAuth extends Component<IProps> {
  renderStatus = (theme: ITheme) => {
    const {status, requestAuthorPhotos} = this.props;

    return (
      <View>
        <Text style={styles.textPhotos}>
          {theme.textPhotos?.photoPermission}
        </Text>
        <Text style={styles.textPhotosDescription}>
          {theme.textPhotos?.photoPermissionDescription}
        </Text>
        <Pressable onPress={requestAuthorPhotos}>
          <Text style={styles.buttonSubmit}>
            {
              theme.textPhotos?.[
                status.status === 'notDetermined'
                  ? 'photoPermissionButton'
                  : 'gotoSetting'
              ]
            }
          </Text>
        </Pressable>
      </View>
    );
  };

  render() {
    return (
      <ProviderChat.Consumer>
        {({theme}) => (
          <View style={styles.view}>{this.renderStatus(theme)}</View>
        )}
      </ProviderChat.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  textPhotos: {
    textAlign: 'center',
    color: '#22081e',
    fontWeight: '700',
    fontSize: 16,
  },
  textPhotosDescription: {
    textAlign: 'center',
    color: '#29141f',
    fontSize: 15,
    marginHorizontal: 23,
    paddingTop: 8,
    lineHeight: 19,
    fontWeight: '500',
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    marginHorizontal: 12,
  },
  buttonSubmit: {
    color: colorLink,
    fontWeight: '600',
    textAlign: 'center',
    paddingTop: 14,
    paddingBottom: bar.bottomHeight + 20,
  },
});

export default StatusAuth;
