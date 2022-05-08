import React, {Component} from 'react';

import {SvgXml as SvgXmlLibrary, XmlProps} from 'react-native-svg';

class SvgXml extends Component<XmlProps> {
  render() {
    return <SvgXmlLibrary {...this.props} />;
  }
}

export default SvgXml;
