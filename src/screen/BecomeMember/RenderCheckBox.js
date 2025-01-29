import { Text, View } from 'react-native'
import CheckBox from 'react-native-check-box'
import COLORS from '../../styles/theme/color'
import style from '../../styles/style'

const RenderCheckBox = ({ name, value, setValue, disabled,onchange }) => {
    const onChangeHandler =()=>{
        if(onchange){
            onchange()
        }else{
            setValue(!value)
        }
    }
    return (
        <View style={[style.row, { alignItems: "center", display: "flex" }, style.mt10]}>
            <CheckBox
                isChecked={value}
                onClick={() => onChangeHandler()}
                checkBoxColor={COLORS.PRIMARY}
                disabled={disabled ? true : false}
            />
            <Text style={[style.font16, { maxWidth: '90%' }, style.mH10]}>{name}</Text>
        </View>
    )
}

export default RenderCheckBox