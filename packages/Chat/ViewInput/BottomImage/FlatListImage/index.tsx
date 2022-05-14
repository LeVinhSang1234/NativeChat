import bar from '@/utils/bar';
import React, {Component} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import ListImage from '../ListImage';

interface IProps {
  heightScreen: number;
  widthScreen: number;
  photos: any[];
  handleScrollView: any;
}

class FlatListImage extends Component<IProps> {
  shouldComponentUpdate(nProps: IProps) {
    const {widthScreen, heightScreen, photos} = this.props;
    return (
      widthScreen !== nProps.widthScreen ||
      heightScreen !== nProps.heightScreen ||
      photos !== nProps.photos
    );
  }

  renderItem = ({item}: any) => {
    const {heightScreen, widthScreen} = this.props;
    return (
      <ListImage
        widthScreen={widthScreen}
        heightScreen={heightScreen}
        image={item.image}
      />
    );
  };

  render() {
    const {photos, handleScrollView} = this.props;
    return (
      <FlatList
        numColumns={3}
        data={photos}
        renderItem={this.renderItem}
        onScroll={handleScrollView}
        scrollEventThrottle={0}
        style={styles.scrollView}
      />
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: bar.bottomHeight + 10,
  },
});

export default FlatListImage;
