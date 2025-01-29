import {View, Text, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons'
import COLORS from '../styles/theme/color';
import { normalize } from '../styles/utilities/dimentions';
import { ActivityIndicator } from 'react-native-paper';
import style from '../styles/style';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DropdownSelector = ({
  key = 'id',
  placeholder = 'Choose some things...',
  onSelectedItemsChange = {},
  isObjectSelect = true,
  onSelectedItemObjectsChange = {},
  selectedItems,
  otherStyle,
  single = false,
  hideConfirm = true,
  items,
  inputTitle,
  inputTitleStyle,
  displayKey = 'name',
  required,
  loading
}:any) => {
  return (
    <View>
      {inputTitle && (
        <View style={styles.inputLabelWrapper}>
          <Text style={[styles.inputTitleStyle, inputTitleStyle]}>
            {inputTitle}{required && <Text style={styles.textDanger}> *</Text>}
          </Text>
        </View>
      )}
      <View style={[styles.borderStyle, otherStyle]}>
        <SectionedMultiSelect
          loading={loading}
          loadingComponent={<ActivityIndicator style={style.mt40} theme={{ colors: { primary: COLORS.PRIMARY } }} size={'small'} />}
          items={items}
          IconRenderer={Icon}
          single={single}
          uniqueKey={key}
          displayKey={displayKey}
          selectText={placeholder}
          showDropDowns={true}
          readOnlyHeadings={false}
          // onSelectedItemsChange={onSelectedItemsChange}
          selectedItems={selectedItems}
          onSelectedItemsChange={item => {
            onSelectedItemsChange(item);
          }}
          showChips={false}
          hideConfirm={false}
          showCancelButton={true}
          confirmText={'Select'}
          searchPlaceholderText="Search here"
          colors={{
            primary: COLORS.PRIMARY,
            success: COLORS.PRIMARY,
          }}
          styles={{
            modalWrapper: {
              flex: 1,
              justifyContent: 'center',
            },
            backdrop: {
              justifyContent: 'center',
            },
            searchTextInput: {
              color: COLORS.BLACK, 
            },
            searchIcon: {
              color: COLORS.GREEN
            },
            selectToggle: {
              flex: 0,
              // borderColor: "rgba(110, 120, 170, 1)",
              padding: 10,
              marginTop: 0,
              borderRadius: 10,
              alignSelf: 'space-around',
            },
            selectToggleText: {
              color: COLORS.BLACK,
              zIndex: 10,
            //   fontFamily: FONTS.MulishRegular,
              fontSize: normalize(14),
            },
            container: {
              flex: 0,
              height: SCREEN_HEIGHT / 2 - 50,
              width:SCREEN_WIDTH/1.2,
              marginLeft:'auto',
              marginRight:'auto'
            },
            scrollView: {
              flexBasis: '70%',
            },

          }}
        />
      </View>
    </View>
  );
};

export default DropdownSelector;

const styles = StyleSheet.create({
  borderStyle: {
    backgroundColor:'#fff',
    borderWidth: 1,
    borderColor: COLORS.GREY,
    borderRadius: normalize(8),
    paddingHorizontal: normalize(5),
    width: '100%',
    height: normalize(34)
  },
  inputTitleStyle: {
    fontSize:normalize(14),
    fontFamily:'Roboto-Regular',
    color:COLORS.BLACK,
    marginTop:normalize(10),
    fontWeight:'600'
  },
  inputLabelWrapper: {
    flexDirection: 'row',
    // marginLeft: scaleWidth(18),
    alignItems: 'center',
    marginTop: normalize(5),
  },
  textDanger: {
    color: 'red',
    fontSize: normalize(12)
  },
});
