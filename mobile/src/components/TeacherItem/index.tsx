import React from 'react';
import { View, Image, Text } from 'react-native';

import heartOutlineIcon from '../../assets/images/icons/heart-outline.png';
import unfavoriteIcon from '../../assets/images/icons/unfavorite.png';
import whatsappIcon from '../../assets/images/icons/whatsapp.png';

import styles from './styles';
import { RectButton } from 'react-native-gesture-handler';

function TeacherItem() {
	return (
		<View style={styles.container}>
			<View style={styles.profile}>
				<Image
					style={styles.avatar}
					source={{ uri: 'https://github.com/ltsaiete.png' }}
				/>

				<View style={styles.profileInfo}>
					<Text style={styles.name}>Luis Saiete</Text>
					<Text style={styles.subject}>Fisica</Text>
				</View>
			</View>

			<Text style={styles.bio}>
			My first code wasn't Hello World, so call me Senpai.
			</Text>

			<View style={styles.footer} >
				<Text style={styles.price}>
					Preço/hora {'   '}
					<Text style={styles.priceValue}>50,00 Mzn</Text>
				</Text>

				<View style={styles.buttonsContainer}>
					<RectButton style={[styles.favoriteButton, styles.favorited]}>
						{/*<Image source={heartOutlineIcon} />*/}

						<Image source={unfavoriteIcon} />
					</RectButton>

					<RectButton style={styles.contactButton}>
						<Image source={whatsappIcon} />
						<Text style={styles.contactButtonText}>Entrar em contacto</Text>
					</RectButton>
				</View>
			</View>
		</View>
	)
}

export default TeacherItem;
