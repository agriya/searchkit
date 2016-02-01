import * as React from "react";
import "../styles/index.scss";

import {
	SearchkitManager,
	SearchkitComponent,
	FacetAccessor,
	FastClick,
	SearchkitComponentProps,
	ReactComponentType
} from "../../../../../core"

const defaults = require("lodash/defaults")
const size = require("lodash/size")
const map = require("lodash/map")

export const FilterItem:React.StatelessComponent<FilterItemProps> = (props)=> (
  	<div className={props.bemBlocks.option()
			.mix(props.bemBlocks.container("item"))
			.mix(`selected-filter--${props.filter.id}`)()}>
			<div className={props.bemBlocks.option("name")}>{props.translate(props.filter.name)}: {props.translate(props.filter.value)}</div>
			<FastClick handler={props.removeFilter}>
				<div className={props.bemBlocks.option("remove-action")}>x</div>
			</FastClick>
		</div>
)

export interface FilterItemProps {
	key:string,
	bemBlocks?:any,
	filter:any,
	removeFilter:any,
	translate:any
}

export interface SelectedFiltersProps extends SearchkitComponentProps {
	filterItemComponent?:ReactComponentType<FilterItemProps>
}

export class SelectedFilters extends SearchkitComponent<SelectedFiltersProps, any> {

	static propTypes = defaults({
	}, SearchkitComponent.propTypes)

	static defaultProps = {
     filterItemComponent: FilterItem
   }

	constructor(props) {
		super(props)
		this.translate = this.translate.bind(this)
	}

	defineBEMBlocks() {
		var blockName = (this.props.mod || "selected-filters")
		return {
			container: blockName,
			option:`${blockName}-option`
		}
	}

	getFilters():Array<any> {
		return this.getQuery().getSelectedFilters()
	}

	hasFilters():boolean {
		return size(this.getFilters()) > 0;
	}

	renderFilter(filter) {

		return React.createElement(this.props.filterItemComponent, {
			key:filter.value,
			bemBlocks:this.bemBlocks,
			filter:filter,
			removeFilter:this.removeFilter.bind(this, filter),
			translate:this.translate
		})
	}

	removeFilter(filter) {
		filter.remove()
		this.searchkit.performSearch()
	}

  render() {
		if (!this.hasFilters()) {
			return null
		}
    return (
      <div className={this.bemBlocks.container()}>
				{map(this.getFilters(), this.renderFilter.bind(this))}
      </div>
    )
  }
}
