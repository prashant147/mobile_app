import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { sliceString } from '../../../../styles/utilities/variables';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import style from '../../../../styles/style';
import COLORS from '../../../../styles/theme/color';

const RenderSelectedUsersComponent = memo(({ item, index, handleSelectMembers, selectedItems }) => {
    const { uid, avatar, name } = item;

    if (!selectedItems.includes(uid)) return null;

    const handleRemoveMember = useCallback(() => {
        handleSelectMembers(item);
    }, [handleSelectMembers, item]);

    return (
        <View style={[style.mv7, style.column, style.centerBox, index === 0 ? style.mr5 : style.mH5]} key={uid}>
            <View style={styles.avatarContainer}>
                {selectedItems.length > 1 && (
                    <TouchableOpacity onPress={handleRemoveMember} style={styles.closeButton}>
                        <AntDesign name="closecircle" size={20} color={COLORS.BLACK} />
                    </TouchableOpacity>
                )}
                {avatar ? (
                    <FastImage source={{ uri: avatar }} style={styles.avatar} />
                ) : (
                    <FontAwesome5 name="user" size={25} solid color="#ffffff" />
                )}
            </View>
            <Text style={styles.userName}>{sliceString(name, 8)}</Text>
        </View>
    );
});

export default RenderSelectedUsersComponent;

const styles = StyleSheet.create({
    avatarContainer: {
        backgroundColor: COLORS.DARK_PRIMARY,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        height: 50,
        width: 50,
        position: "relative",
    },
    closeButton: {
        position: "absolute",
        top: 0,
        right: -5,
        borderWidth: 0.5,
        borderColor: COLORS.OFFWHITE,
        borderRadius: 30,
        backgroundColor: "white",
        zIndex: 1,
    },
    avatar: {
        width: "100%",
        height: "100%",
        borderRadius: 50,
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.BLACK,
        marginTop: 5,
    }
});
