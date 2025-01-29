import { Keyboard, StyleSheet, Text, TextInput, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import COLORS from "../../styles/theme/color";
import style from "../../styles/style";
import { normalize } from "../../styles/utilities/dimentions";
import moment from "moment";
import { TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';

const RenderInput = ({ name, dobName, placeholder, value, setValue, keyboardType, type, setShowPicker, showPicker, numberOfLines, multiline, valueError, onChangeText,textContentType,required ,maxLength,setValueError,stylesProp,NoMaxDate,inputStyle,readOnly,nameStyle,editable}) => {

    const handleDate = (event, date) => {
        setShowPicker(false)
        if (date !== undefined) {
            setValue(date);
        }
    };

    const handleChangeText = (txt) => {                        
        if (onChangeText) {
            onChangeText(txt);
            setValueError &&  setValueError('');
        } else {
            setValue(txt);
            setValueError &&  setValueError('');
        }
    };
    
    const handlePicker =()=>{
        if(value instanceof Date === false){
            setValue(new Date()) 
            setShowPicker(!showPicker)
        }else{
            setShowPicker(!showPicker)

        }
    }
    return (
        <View style={[style.mtb5,stylesProp]}>
            {name && <Text onPress={()=> Keyboard.dismiss()} style={[style.font14, style.BlackbuttonTxt,nameStyle ]}>{name}{required && <Text style={styles.textDanger}> *</Text>} </Text>}
            {dobName && <Text onPress={()=> Keyboard.dismiss()}  style={[style.font16, style.BlackbuttonTxt, nameStyle]}>{dobName}{required && <Text style={styles.textDanger}>*</Text>} </Text>}
            <View style={[styles.inputBorderStyle,inputStyle]}>
                <TextInput
                    style={[styles.input, type === 'date' ?{width:'80%'}:{width:"100%"},{opacity:readOnly?0.7:1}]}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.GREY}
                    value={type === 'date' ?(value instanceof Date ? moment(value).format("YYYY-MM-DD") :"") : value}
                    readOnly={type === 'date' || readOnly}
                    onChangeText={handleChangeText}
                    keyboardType={keyboardType ? keyboardType : 'default'}
                    multiline={multiline}
                    textAlignVertical={ 'top' }
                    numberOfLines={numberOfLines}
                    autoCapitalize="none"
                    editable={editable}
                    maxLength={maxLength}
                    ></TextInput>
                    {type === 'date' && value &&<TouchableOpacity onPress={()=>setValue()}> 
                        <Icon name="close" size={20} color="#000" />
                         </TouchableOpacity>}
                {type === 'date' && <View>
                    <TouchableOpacity onPress={handlePicker} >
                        <MaterialIcons name='calendar-month' size={25} color={COLORS.PRIMARY} />
                    </TouchableOpacity>
                    {showPicker && <DateTimePicker
                        value={value}
                        mode="date"
                        display="default"
                        onChange={handleDate}
                        maximumDate={NoMaxDate ? undefined :new Date()}
                    />}
                </View>}

            </View>
            {valueError && <Text style={[styles.textDanger]}>{valueError} </Text>}
        </View>
    )
}

export default RenderInput

const styles = StyleSheet.create({
    inputBorderStyle: {
        borderWidth: 1,
        borderColor: COLORS.GREY,
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(0),
        borderRadius: 4,
        marginVertical: normalize(5),
        backgroundColor: '#f2f4f6',
        width: '100%',
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        height: normalize(35),

    },
    input: {
        color: '#000',
        height: '100%',
    },
    textDanger: {
        color: 'red',
        fontSize: normalize(12)
      },
})
