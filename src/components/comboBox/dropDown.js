import React, { PropTypes } from 'react';

export default class Dropdown extends React.Component {
  constructor(props) {
    super(props);

    this.displayName = 'Dropdown';

    this.onInput = this.onInput.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.inputDebounce = null;
  }

  onInput() {
    const {store} = this.props;

    if (this.inputDebounce) {
      clearTimeout(this.inputDebounce);
    }

    this.inputDebounce = setTimeout(() => {
      store.dispatch(store.actions.filter(this.refs.search.value));
    }, 300);
  }

  onBlur(evt, id, originalEvent) {
    this.props.onBlur && this.props.onBlur(evt, id, originalEvent);
  }

  onFocus() {
  }

  onKeyDown(evt) {
    const {store} = this.props;
    const state = store.getState();

    switch (evt.which) {
      case 38: // UP
        store.dispatch(store.actions.up());
        evt.preventDefault();
        break;
      case 40: // DOWN
        store.dispatch(store.actions.down());
        evt.preventDefault();
        break;
      case 13: // ENTER
        const current = state.items[state.position];

        if (current) {
          this.select(current)(evt);
        } else {
          store.dispatch(store.actions.close());
        }

        break;
      case 27: // ESC
        store.dispatch(store.actions.close());
        evt.preventDefault();
        break;
      default:
    }
  }

  componentDidMount() {
    const {search} = this.refs;
    search.focus();
    search.selectionStart = search.selectionEnd = search.value.length;
  }

  select(item) {
    return evt => {
      const {store, onChange} = this.props;
      onChange && onChange(item);

      evt.preventDefault();
    }
  }

  render() {
    const {itemKey, itemLabel, store} = this.props;

    const data = store.getState();

    let popupMessage = null;

    const items = data.items.map((e, index) => {
      const classes = [];
      if (index == data.position) {
        classes.push('active');
      }
      if (data.selected) {
        if (itemKey(data.selected) === itemKey(e)) {
          classes.push('selected');
        }
      }
      return (
        <li key={ itemKey(e) } className={ classes.join(' ') }>
          <a href="javascript:;" onClick={ this.select(e) } tabIndex="-1">
            { itemLabel(e) }
          </a>
        </li>
        )
      }
      );

      if (items.length < 1) {
        popupMessage = <li className="dropdown-menu-text">Não há resultados</li>
      }

      return (
        <div style={ {  userSelect: 'none'} } ref="holder">
          <ul className="combobox-dropdown-menu dropdown-menu" style={ {  display: 'block'} }>
            <li className="dropdown-menu-search">
              <input type="text" className="form-control" ref="search" defaultValue={ data.filter } onChange={ this.onInput } onBlur={ this.onBlur } onFocus={ this.onFocus }
              onKeyDown={ this.onKeyDown } />
            </li>
            { items }
            { popupMessage }
            <li role="separator" className="divider"></li>
            <li className="dropdown-menu-text">
              { data.status }
            </li>
          </ul>
        </div>
        )
    }

  }