import React, {Component, Fragment} from 'react';
import {NativeEventEmitter, StyleSheet, View} from 'react-native';
import Text from '../Text';
import {IError, IItemProps} from './types';

interface IStateItem {
  valueState: {value: any; error: any};
  initialValues: {value: any; error: any};
}

class Item extends Component<
  IItemProps & {form: any; errors: IError},
  IStateItem
> {
  constructor(props: IItemProps & {form: any; errors: IError}) {
    super(props);
    const {value, defaultValue, validateFirst, name, form = {}} = props;
    const initialValues = {value: value || defaultValue, error: undefined};
    this.state = {
      valueState: {value: value || defaultValue, error: undefined},
      initialValues,
    };
    this.handleRemapItem(props);
    if (name && validateFirst) {
      form.ref[name](initialValues.value);
    }
  }

  shouldComponentUpdate(nProps: IItemProps, nState: IStateItem) {
    const {label, children} = this.props;
    const {valueState} = this.state;
    return (
      label !== nProps.label ||
      valueState !== nState.valueState ||
      children !== nProps.children
    );
  }

  componentWillUnmount() {
    const {name, form, errors} = this.props;
    delete errors[name];
    delete form.ref[name];
    delete form.value[name];
    delete form.touched[name];
  }

  handleRemapItem = (props: IItemProps & {form: any; errors: IError}) => {
    const {
      name,
      onParseField,
      defaultValue,
      onChangeInput,
      rule = {},
      form,
      errors,
    } = props;
    if (name && onParseField) {
      onParseField(name, defaultValue);
      form.ref[name] = (
        val: string | undefined = undefined,
        error: string,
        detectValidate?: boolean,
      ) => {
        const {initialValues} = this.state;
        const {value} = this.props;
        if (!detectValidate && onChangeInput) {
          onChangeInput(val);
        }
        if ((val || '') !== (initialValues.value || '')) {
          form.touched[name] = true;
        } else {
          form.touched[name] = false;
        }
        const newValue = {...value, value: val};
        let v = val;
        if (rule.whitespace && v && typeof v === 'string') {
          v = v.trim();
        }
        if (error) {
          newValue.error = error;
        } else if (rule.required && !v) {
          if (rule.message) {
            newValue.error = rule.message;
          } else {
            newValue.error = 'Field is required';
          }
        } else if (
          rule.validator &&
          typeof rule.validator === 'function' &&
          (rule.trigger === 'onChange' || !rule.trigger || detectValidate)
        ) {
          rule.validator(
            v,
            (message: string | undefined) => {
              newValue.error = message;
            },
            form.touched,
          );
        }
        if (newValue.error) {
          if (errors[name] !== newValue.error) {
            errors[name] = newValue.error;
          }
        } else {
          delete errors[name];
        }
        this.setState({valueState: newValue});
      };
    }
  };

  renderWithLabel = (
    styleForm: object | undefined,
    styleSpanCol: object | undefined,
    styleSpanWrapCol: object | undefined,
  ) => {
    const {
      dotRequired,
      rule = {},
      label,
      name,
      colon,
      children,
      onChange,
      onPress,
      onChangeText,
      onValueChange,
      onBlur,
      onBlurInput,
    } = this.props;
    const {valueState} = this.state;
    return (
      <View style={styleForm}>
        <View style={styleSpanCol}>
          <View style={styles.Viewlabel}>
            {rule.required && dotRequired === 'before' ? (
              <Text style={styles.dotRequired}>*</Text>
            ) : null}
            {typeof label === 'string' ? (
              <Text style={styles.label}>{label}</Text>
            ) : (
              label
            )}
            {rule.required && dotRequired === 'after' ? (
              <Text style={styles.dotRequiredAfter}>*</Text>
            ) : null}
            <Text>{colon ? ':' : ''}</Text>
          </View>
        </View>
        <View style={styleSpanWrapCol}>
          {{
            ...children,
            props: {
              ...children.props,
              onChange: (v: string) => onChange?.(v, name),
              value: valueState.value,
              error: valueState.error,
              onPress: (e: NativeEventEmitter) =>
                onPress?.(e, children.props.onPress),
              onValueChange: (e: NativeEventEmitter) =>
                onValueChange?.(e, name),
              onChangeText: (e: string) => onChangeText?.(e, name),
              checked: !!valueState.value,
              onBlur: (e: NativeEventEmitter) => {
                if (typeof onBlur === 'function') {
                  onBlur(e);
                }
                if (
                  typeof onBlurInput === 'function' &&
                  rule.trigger === 'blur'
                ) {
                  onBlurInput(name, valueState.value);
                }
              },
            },
          }}
          <Text style={styles.error}>{valueState.error}</Text>
        </View>
      </View>
    );
  };

  render() {
    const {
      children,
      name,
      onChange,
      onPress = () => null,
      rule = {},
      onValueChange,
      onChangeText,
      label,
      onBlurInput,
      onBlur,
    } = this.props;
    const {valueState} = this.state;

    if (label) {
      return this.renderWithLabel(undefined, undefined, undefined);
    }

    return (
      <Fragment>
        {{
          ...children,
          props: {
            ...children.props,
            onChange: (v: string) => onChange?.(v, name),
            value: valueState.value,
            error: valueState.error,
            onPress: (e: NativeEventEmitter) =>
              onPress(e, children.props.onPress),
            onValueChange: (e: NativeEventEmitter) => onValueChange?.(e, name),
            onChangeText: (e: NativeEventEmitter) => onChangeText?.(e, name),
            checked: !!valueState.value,
            onBlur: (e: NativeEventEmitter) => {
              if (typeof onBlur === 'function') {
                onBlur(e);
              }
              if (
                typeof onBlurInput === 'function' &&
                rule.trigger === 'blur'
              ) {
                onBlurInput(name, valueState.value);
              }
            },
          },
        }}
        <Text style={styles.error}>{valueState.error}</Text>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  label: {},
  Viewlabel: {
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotRequired: {
    color: '#ff4d4f',
    marginRight: 4,
  },
  dotRequiredAfter: {
    color: '#ff4d4f',
    marginRight: 2,
    marginLeft: 2,
  },
  layoutForm: {
    flexDirection: 'row',
  },
  styleSpanCol: {
    minHeight: 34,
    paddingTop: 8.5,
    paddingBottom: 8.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 8,
  },
  error: {
    minHeight: 22,
    fontSize: 12,
    color: '#ff4d4f',
    lineHeight: 16,
    paddingBottom: 5,
  },
});

export default Item;
