export interface axisType {
  x:String,
  y:Number
}

export interface pieType {
  item:String,
  value:Number
}

export interface ChartSource {
  item: String,
  person: Number,
  team: Number,
  dept: Number
}

export interface AxisIndicator {
  text: String,
  max: Number,
  unit?: String
}

export interface RadarType {
  name: String,
  value: Number[]
}
