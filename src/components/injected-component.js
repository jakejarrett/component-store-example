/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

/*
Public: InjectedComponent makes it easy to include dynamically registered
components inside of your React render method. Rather than explicitly render
a component, such as a `<Composer>`, you can use InjectedComponent:

```coffee
<InjectedComponent matching={role:"Composer"} exposedProps={draftId:123} />
```

InjectedComponent will look up the component registered with that role in the
{ComponentStore} and render it, passing the exposedProps (`draftId={123}`) along.

InjectedComponent monitors the ComponentStore for changes. If a new component
is registered that matches the descriptor you provide, InjectedComponent will refresh.

If no matching component is found, the InjectedComponent renders an empty div.

Section: Component Kit
*/
let InjectedComponent;
window.InjectedComponent = InjectedComponent = (function() {
  InjectedComponent = class InjectedComponent extends React.Component {
    static initClass() {
      this.displayName = 'InjectedComponent';

      /*
      Public: React `props` supported by InjectedComponent:
  
       - `matching` Pass an {Object} with ComponentStore descriptors.
          This set of descriptors is provided to {ComponentStore::findComponentsForDescriptor}
          to retrieve the component that will be displayed.
  
       - `className` (optional) A {String} class name for the containing element.
  
       - `exposedProps` (optional) An {Object} with props that will be passed to each
          item rendered into the set.
  
      */
      this.propTypes = {
        matching: React.PropTypes.object.isRequired,
        className: React.PropTypes.string,
        exposedProps: React.PropTypes.object,
      };
    }

    constructor(props) {
      {
        // Hack: trick Babel/TypeScript into allowing this before super.
        if (false) {
          super();
        }
        let thisFn = (() => {
          return this;
        }).toString();
        let thisName = thisFn
          .slice(thisFn.indexOf('return') + 6 + 1, thisFn.indexOf(';'))
          .trim();
        eval(`${thisName} = this;`);
      }
      this.componentDidMount = this.componentDidMount.bind(this);
      this.componentWillUnmount = this.componentWillUnmount.bind(this);
      this.componentWillReceiveProps = this.componentWillReceiveProps.bind(
        this,
      );
      this.render = this.render.bind(this);
      this.focus = this.focus.bind(this);
      this.blur = this.blur.bind(this);
      this._getStateFromStores = this._getStateFromStores.bind(this);
      this.props = props;
      this.state = this._getStateFromStores();
    }

    componentDidMount() {
      return (this._componentUnlistener = ComponentStore.listen(() => {
        return this.setState(this._getStateFromStores());
      }));
    }

    componentWillUnmount() {
      if (this._componentUnlistener) {
        return this._componentUnlistener();
      }
    }

    componentWillReceiveProps(newProps) {
      if (
        !_.isEqual(
          newProps.matching,
          this.props != null ? this.props.matching : undefined,
        )
      ) {
        return this.setState(this._getStateFromStores(newProps));
      }
    }

    render() {
      let element;
      if (!this.state.component) {
        return React.createElement('div', null);
      }

      const exposedProps =
        this.props.exposedProps != null ? this.props.exposedProps : {};
      let className = this.props.className != null ? this.props.className : '';
      if (this.state.visible) {
        className += 'registered-region-visible';
      }

      const Component = this.state.component;

      if (Component.containerRequired === false) {
        element = React.createElement(
          Component,
          Object.assign(
            { ref: 'inner', key: Component.displayName },
            exposedProps,
          ),
        );
      } else {
        element = React.createElement(
          UnsafeComponent,
          Object.assign(
            { ref: 'inner', component: Component, key: Component.displayName },
            exposedProps,
          ),
        );
      }

      if (this.state.visible) {
        return React.createElement(
          'div',
          { className: className },
          element,
          React.createElement(
            InjectedComponentLabel,
            Object.assign({ matching: this.props.matching }, exposedProps),
          ),
          React.createElement('span', { style: { clear: 'both' } }),
        );
      } else {
        return React.createElement('div', { className: className }, element);
      }
    }

    focus() {
      // Not forwarding event - just a method call
      // Note that our inner may not be populated, and it may not have a focus method
      if (
        (this.refs.inner != null ? this.refs.inner.focus : undefined) != null
      ) {
        return this.refs.inner.focus();
      }
    }

    blur() {
      // Not forwarding an event - just a method call
      // Note that our inner may not be populated, and it may not have a blur method
      if (
        (this.refs.inner != null ? this.refs.inner.blur : undefined) != null
      ) {
        return this.refs.inner.blur();
      }
    }

    _getStateFromStores(props) {
      if (props == null) {
        ({ props } = this);
      }

      const components = ComponentStore.findComponentsMatching(props.matching);
      if (components.length > 1) {
        console.warn(`There are multiple components available for \
${JSON.stringify(props.matching)}. <InjectedComponent> is \
only rendering the first one.`);
      }

      return {
        component: components[0],
        visible: ComponentStore.showComponentRegions(),
      };
    }
  };
  InjectedComponent.initClass();
  return InjectedComponent;
})();
