import {ReactChild} from 'react';
import {ViewStyle} from 'react-native';

export declare type IItemProps = {
  children?: any;
  defaultValue?: any;
  checked?: boolean;
  name: string;
  onBlurInput?: any;
  onBlur?: any;
  onParseField?: (v: any, callback: any) => any;
  onChange?: (v: any, name: string) => any;
  value?: any;
  onPress?: (v: any, key: any) => any;
  rule?: {
    whitespace?: boolean;
    required?: boolean;
    message?: any;
    validator?: (v: any, callback: (v?: any) => any, touched?: any) => any;
    trigger?: 'onChange' | 'blur';
  };
  validateFirst?: boolean;
  onValueChange?: (v: any, key: string) => any;
  onChangeText?: (v: any, name: string) => any;
  onChangeInput?: (v: any, key: any) => any;
  label?: any;
  colon?: string;
  dotRequired?: string;
  formItemLayout?: {
    labelCol: {
      xs: number;
      sm: number;
    };
    wrapperCol: {
      xs: number;
      sm: number;
    };
  };
};

export interface IErrorForm {
  [key: string]: any;
}

export interface IValueForm {
  [key: string]: any;
}

export declare type IFormHandle = {
  setFieldsValue: (value: any, errors?: any) => void;
  setFieldValue: (
    key: string,
    value?: any,
    error?: ReactChild | undefined,
  ) => void;
  getFieldValue: (field: string) => any;
  getFieldsValue: () => any;
  validateFields: (
    calback?: (err?: IErrorForm, values?: IValueForm) => any,
    data?: {fields?: string[]; excepts?: string[]},
  ) => Promise<{errors: {[key: string]: any}; values: {[key: string]: any}}>;
  resetFields: (fields?: any, errors?: any) => void;
  setFieldError: (field: string, error?: any) => void;
  getTouched: (field?: string) => any;
};

export interface IFormHandleRemap {
  setFieldsValue: (value: any, errors?: any, uid?: string) => void;
  setFieldValue: (
    key: string,
    value?: any,
    error?: ReactChild | undefined,
    uid?: string,
  ) => void;
  getFieldValue: (field: string, uid?: string) => any;
  getFieldsValue: (uid?: string) => any;
  validateFields: (
    calback?: (err?: IErrorForm, values?: IValueForm) => any,
    data?: {fields?: string[]; excepts?: string[]},
    uid?: string,
  ) => Promise<any>;
  resetFields: (fields?: any, errors?: any, uid?: string) => void;
  setFieldError: (field: string, error?: any, uid?: string) => void;
  getTouched: (field?: string, uid?: string) => any;
}

export interface IError {
  [key: string]: any;
}

export interface IFormProps {
  initialValues?: {
    [key: string]: any;
  };
  children: any;
  validateFirst?: boolean;
  style?: ViewStyle;
  colon?: boolean;
  formItemLayout?: {
    labelCol: {
      xs: number;
      sm: number;
    };
    wrapperCol: {
      xs: number;
      sm: number;
    };
  };
  dotRequired?: 'before' | 'after';
  form?: IFormHandle & {uid: string};
}

export interface IForm {
  [key: string]: {
    ref: {[key: string]: any};
    value: {[key: string]: any};
    touched: {[key: string]: any};
    validateFirst?: boolean;
  };
}
