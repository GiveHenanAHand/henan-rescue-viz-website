import shallowEqual from 'shallowequal';
import { PureComponent } from 'react'

export default class LocationControl extends PureComponent {

    componentDidUpdate(prevProps) {
        if (!this.map) {
            this.initialize();
            return;
        }
        let {anchor, offset} = this.props;
        let {anchor: preAnchor, offset: preOffset} = prevProps;

        let isAnchorChanged = !shallowEqual(anchor, preAnchor);
        let isOffsetChanged = !shallowEqual(offset, preOffset);
        if (anchor && isAnchorChanged) {
            this.control.setAnchor(anchor);
        }
        if (offset && isOffsetChanged) {
            this.control.setOffset(offset);
        }
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        if (this.control && this.map) {
            this.map.removeControl(this.control);
            // @ts-ignore
            this.control = null;
        }
    }

    initialize() {
        let map = this.props.map
        if (!map) {
            return;
        }

        this.destroy();

        this.control = this.getControl();
        map.addControl(this.control);
    }

    getControl() {
        return new window.BMapGL.LocationControl();
    }

    render() {
        return null;
    }
}
