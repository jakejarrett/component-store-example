/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
/*
Public: A small component that displays a string describing
the role and exposed props of an InjectedComponentSet:

location: 'composer-actions' (draft: <object>, ids: <array>)

*/
let InjectedComponentLabel;
window.InjectedComponentLabel = InjectedComponentLabel = (function() {
  InjectedComponentLabel = class InjectedComponentLabel extends React.Component {
    static initClass() {
      this.displayName = 'InjectedComponentLabel';
    }

    render() {
      let val;
      const matchingDescriptions = [];
      for (var key in this.props.matching) {
        val = this.props.matching[key];
        if (key === 'location') {
          val = val.id;
        }
        if (key === 'locations') {
          val = _.pluck(val, 'id');
        }
        matchingDescriptions.push(`${key}: ${val}`);
      }

      const propDescriptions = [];
      for (key in this.props) {
        val = this.props[key];
        if (key === 'matching') {
          continue;
        }
        propDescriptions.push(
          `${key}:<${
            __guard__(val != null ? val.constructor : undefined, x => x.name) !=
            null
              ? __guard__(
                  val != null ? val.constructor : undefined,
                  x => x.name,
                )
              : typeof val
          }>`,
        );
      }

      let description = ` ${matchingDescriptions.join(', ')}`;
      if (propDescriptions.length > 0) {
        description += ` (${propDescriptions.join(', ')})`;
      }

      return React.createElement('span', { className: 'name' }, description);
    }
  };
  InjectedComponentLabel.initClass();
  return InjectedComponentLabel;
})();

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
