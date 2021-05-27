import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Platform, Alert, TouchableOpacity, ScrollView } from "react-native";
import { SvgFromUri } from "react-native-svg";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { useRoute } from "@react-navigation/core";
import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import { format, isBefore } from "date-fns";
import { useNavigation } from "@react-navigation/native";

import { Button } from "../components/Button";
import { PlantProps, savePlant } from "../libs/storage";

import waterdrop from "../assets/waterdrop.png";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
 
interface Params {
    plant: PlantProps
}

export function PlantSave(){
    const { navigate } = useNavigation();
    const route = useRoute();
    const { plant } = route.params as Params;
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [showDateTime, setShowDateTime] = useState(Platform.OS === "ios");


    function handleChangeTime(event: Event, dateTime: Date | undefined){
        if(Platform.OS === "android"){
            setShowDateTime(oldState => !oldState);
        }

        if(dateTime && isBefore(dateTime, new Date())){
            setSelectedDateTime(new Date());
            return Alert.alert("Escolha uma hora no futuro! ⏰");
        }

        if(dateTime){
            setSelectedDateTime(dateTime);   
        }
    }

    function handleOpenDateTimePickerForAndroid() {
        setShowDateTime(oldState => !oldState)
    }

    async function handleSave(){
        try {
            await savePlant({
                ...plant,
                dateTimeNotification: selectedDateTime
            });
            navigate("Confirmation", {
                title: "Tudo certo",
                subtitle: "Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha muito cuidado.",
                buttonTitle: "Muito Obrigado :D",
                icon: "hug",
                nextScreen: "MyPlants",
                params: {
                    screen: "MyPlants"
                }
            });
        } catch{
            Alert.alert("Não foi possivel salvar. 😥");    
        }
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.constainer}
        >
            <View style={styles.constainer}>
                <View style={styles.plantInfo} >
                    <SvgFromUri
                        uri={plant.photo}
                        height={150}
                        width={150}
                    />
                    <Text style={styles.plantName}>{plant.name}</Text>
                    <Text style={styles.plantAbout}>{plant.about}</Text>
                </View>
                <View style={styles.controller}>
                    <View style={styles.tipContainer}>
                        <Image source={waterdrop} style={styles.tipImage}/>
                        <Text style={styles.tipText}>{plant.water_tips}</Text>
                    </View>
                    <Text style={styles.alertLabel}>Ecolha o melhor horário para ser lembrado:</Text>
                    {showDateTime && (
                        <DateTimePicker 
                            value={selectedDateTime}
                            mode="time"
                            display="spinner"
                            onChange={handleChangeTime}
                        />
                    )}
                    {
                        Platform.OS === "android" && (
                            <TouchableOpacity
                                style={styles.dateTimePickerButton}
                                onPress={handleOpenDateTimePickerForAndroid}
                            >
                                <Text style={styles.dateTimePickerText}>
                                    {`Mudar ${format(selectedDateTime, "HH: mm")}`}
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                    <Button 
                        title="Cadastrar planta"
                        onPress={handleSave}
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: colors.shape
    },
    plantInfo: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.shape  
    },
    plantName: {
        fontFamily: fonts.heading,
        fontSize: 24,
        color: colors.heading,
        marginTop: 15
    },
    plantAbout: {
        textAlign: "center",
        fontFamily: fonts.text,
        color: colors.heading,
        fontSize: 17,
        marginTop: 10
    },
    controller: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: getBottomSpace() || 20
    },
    tipContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.blue_light,
        padding: 20,
        borderRadius: 20,
        position: "relative",
        bottom: 60
    },
    tipImage: {
        width: 56,
        height: 56
    },
    tipText: {
        flex: 1,
        marginLeft: 20,
        fontFamily: fonts.text,
        color: colors.blue,
        fontSize: 17,
        textAlign: "justify"
    },
    alertLabel: {
        textAlign: "center",
        fontFamily: fonts.complement,
        color: colors.heading,
        fontSize: 12,
        marginBottom: 5
    },
    dateTimePickerButton: {
        width: "100%",
        alignItems: "center",
        paddingVertical: 40
    },
    dateTimePickerText: {
        color: colors.heading,
        fontSize: 24,
        fontFamily: fonts.text
    }
});