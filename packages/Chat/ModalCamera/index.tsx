import React, {Component, lazy, Suspense} from 'react';
import {Modal} from 'react-native';
const Camera = lazy(() => import('@/lib/Camera'));

interface IModalProps {}
interface IModalState {
  isCamera: boolean;
}

class ModalCamera extends Component<IModalProps, IModalState> {
  constructor(props: IModalProps) {
    super(props);
    this.state = {isCamera: true};
  }

  shouldComponentUpdate(_: IModalProps, nState: IModalState) {
    const {isCamera} = this.state;
    return isCamera !== nState.isCamera;
  }

  toggleVisible = (flag: boolean = false) => {
    this.setState({isCamera: flag});
  };

  render() {
    const {isCamera} = this.state;
    return (
      <Modal
        animationType="fade"
        visible={isCamera}
        onRequestClose={this.toggleVisible}>
        <Suspense fallback={null}>
          <Camera defaultOpen />
        </Suspense>
      </Modal>
    );
  }
}

export default ModalCamera;
