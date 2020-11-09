import React from 'react'
import isArray from 'lodash/isArray'
import { useSpring, animated } from 'react-spring'
import classNames from 'classnames'

export default ({
  row,
  index,
  handleClick,
  style = {}
}) => {
  if (!row) {
    return (
      <div>
        <span>Loading more...</span>
      </div>
    )
  }

  const { values: { isOpen } } = row

  const [props, set] = useSpring(() => ({
    transform: 'scale(1)',
    boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 0.30)',
    from: {
      transform: 'scale(0.5)',
      boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 0.30)'
    },
    config: { tension: 400, mass: 2, velocity: 5 }
  }))

  const updateHover = hovering => ({ transform: `scale(${hovering ? 1.02 : 1})` })

  return (
    <animated.tr
      {...row.getRowProps({
        style,
        className: classNames('table__body__row grid-x align-middle align-spaced', { 'table__body__row--open': isOpen, 'table__body__row--close': !isOpen })
      })}
      onClick={(e) => handleClick(row)}
      style={props}
      onMouseEnter={() => isOpen ? set(updateHover(true)) : null}
      onMouseLeave={() => isOpen ? set(updateHover(false)) : null}
    >
      {row.cells.map(cell => {
        const { column: { id }, value } = cell
        const className = id === 'checkbox' || id === 'dropdown'
          ? 'table__body__cell cell small-2'
          : `table__body__cell cell grid-x align-middle small-${Math.ceil(24 / row.cells.length)}`
        if (id === 'name' && isArray(value)) {
          return (
            <td key={index} {...cell.getCellProps({ className })}>
              {value[0].image}
              {value[0].name}
            </td>
          )
        }
        return (
          <td key={index} {...cell.getCellProps({ className })}>
            {cell.render('Cell')}
          </td>
        )
      })}
    </animated.tr>
  )
}