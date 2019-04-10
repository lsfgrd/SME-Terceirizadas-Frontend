import React, { Component } from "react";
import { Field } from "redux-form";
import PropTypes from "prop-types";

export default class RadioboxGroup extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    ).isRequired
  };

  field = ({ input, meta, options }) => {
    const { name, onChange, onBlur, onFocus } = input;
    const { touched, error } = meta;
    const inputValue = input.value;

    const radioes = options.map(({ label, value }, index) => {
      const handleChange = event => {
        const arr = [...inputValue];
        if (event.target.checked) {
          arr[0] = value;
        }
        onBlur(arr);
        return onChange(arr);
      };
      const checked = inputValue.includes(value);
      return (
        <label key={`radio-${index}`}>
          <input
            type="radio"
            name={`${name}[${index}]`}
            value={value}
            checked={checked}
            onChange={handleChange}
            onFocus={onFocus}
          />
          <span>{label}</span>
        </label>
      );
    });

    return (
      <div>
        <div>{radioes}</div>
        {touched && error && <p className="error">{error}</p>}
      </div>
    );
  };

  render() {
    return <Field {...this.props} type="radio" component={this.field} />;
  }
}
