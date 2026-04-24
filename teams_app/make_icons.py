from PIL import Image, ImageDraw

def create_logo(size, is_outline=False):
    # Colors
    brand_green = (58, 125, 68)  # #3A7D44
    off_white = (253, 252, 240)   # #FDFCF0
    black = (0, 0, 0)
    
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # Scale factor
    scale = size / 40
    
    if not is_outline:
        # Rounded Rect
        radius = 8 * scale
        draw.rounded_rectangle([0, 0, size, size], radius=radius, fill=brand_green)
        
        # Play Triangle
        # Path: M12 11L24 20L12 29V11Z
        points = [(12*scale, 11*scale), (24*scale, 20*scale), (12*scale, 29*scale)]
        draw.polygon(points, fill=off_white)
        
        # Vertical Bar
        # rect x=26 y=11 width=3 height=18 rx=1
        draw.rounded_rectangle([26*scale, 11*scale, (26+3)*scale, (11+18)*scale], radius=1*scale, fill=off_white)
    else:
        # Outline is just the shape in black/white
        points = [(12*scale, 11*scale), (24*scale, 20*scale), (12*scale, 29*scale)]
        draw.polygon(points, fill=black)
        draw.rounded_rectangle([26*scale, 11*scale, (26+3)*scale, (11+18)*scale], radius=1*scale, fill=black)
        
    return img

# Generate icons
create_logo(192).save('color.png')
create_logo(32, is_outline=True).save('outline.png')
print("Icons generated: color.png (192x192) and outline.png (32x32)")
